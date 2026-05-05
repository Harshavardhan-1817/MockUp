import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function InterviewRoom({ user }) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { questions, jd, type, difficulty, role_name } = state || {}

  const [currentQ, setCurrentQ] = useState(0)
  const [phase, setPhase] = useState('speaking')
  const [transcript, setTranscript] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [timeLeft, setTimeLeft] = useState(90)
  const [results, setResults] = useState([])
  const [fillerCount, setFillerCount] = useState(0)
  const [eyeContact, setEyeContact] = useState(0.8)
  const [confidence, setConfidence] = useState(0.75)
  const [aiSpeaking, setAiSpeaking] = useState(false)

  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const resultsRef = useRef([])
  const currentQRef = useRef(0)
  const transcriptRef = useRef('')
  const fillerRef = useRef(0)
  const eyeRef = useRef(0.8)
  const confidenceRef = useRef(0.75)
  const phaseRef = useRef('speaking')
  const recognitionRef = useRef(null)
  const isRecordingRef = useRef(false)

  useEffect(() => { resultsRef.current = results }, [results])
  useEffect(() => { currentQRef.current = currentQ }, [currentQ])
  useEffect(() => { transcriptRef.current = transcript }, [transcript])
  useEffect(() => { fillerRef.current = fillerCount }, [fillerCount])
  useEffect(() => { eyeRef.current = eyeContact }, [eyeContact])
  useEffect(() => { confidenceRef.current = confidence }, [confidence])
  useEffect(() => { phaseRef.current = phase }, [phase])

  // Webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream })
      .catch(() => {})
    return () => {
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      window.speechSynthesis.cancel()
      clearInterval(timerRef.current)
    }
  }, [])

  // Speak when question changes
  useEffect(() => {
    if (!questions?.[currentQ]) return
    setPhase('speaking')
    phaseRef.current = 'speaking'
    setTranscript('')
    transcriptRef.current = ''
    setLiveTranscript('')
    setFillerCount(0)
    fillerRef.current = 0
    setTimeLeft(90)
    speakQuestion(questions[currentQ].question)
  }, [currentQ])

  const speakQuestion = (text) => {
    window.speechSynthesis.cancel()
    setAiSpeaking(true)

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred =
        voices.find(v => v.name === 'Google UK English Male') ||
        voices.find(v => v.name === 'Google US English') ||
        voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices[0]

      const utt = new SpeechSynthesisUtterance(text)
      if (preferred) utt.voice = preferred
      utt.rate = 0.85
      utt.pitch = 1.0
      utt.volume = 1

      utt.onend = () => {
        setAiSpeaking(false)
        setPhase('ready')
        phaseRef.current = 'ready'
      }
      utt.onerror = () => {
        setAiSpeaking(false)
        setPhase('ready')
        phaseRef.current = 'ready'
      }
      window.speechSynthesis.speak(utt)
    }

    // Wait for voices to load
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak()
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        trySpeak()
      }
      setTimeout(trySpeak, 500)
    }
  }

  // Timer
  useEffect(() => {
    if (phase !== 'listening') {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleStopRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const handleStartRecording = () => {
    if (isRecordingRef.current) return
    window.speechSynthesis.cancel()
    setAiSpeaking(false)

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Please use Chrome'); return }

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    let finalText = ''

    rec.onstart = () => {
      isRecordingRef.current = true
      startTimeRef.current = Date.now()
      setPhase('listening')
      phaseRef.current = 'listening'

      // Eye contact simulation
      const eyeInterval = setInterval(() => {
        const val = 0.6 + Math.random() * 0.35
        setEyeContact(val)
        eyeRef.current = val
        const conf = 0.6 + Math.random() * 0.35
        setConfidence(conf)
        confidenceRef.current = conf
      }, 2000)
      rec._eyeInterval = eyeInterval
    }

    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          finalText += t + ' '
          const fillers = (t.match(/\b(um|uh|like|you know|basically|literally)\b/gi) || []).length
          fillerRef.current += fillers
          setFillerCount(fillerRef.current)
        } else {
          interim = t
        }
      }
      transcriptRef.current = finalText
      setTranscript(finalText)
      setLiveTranscript(interim)
    }

    rec.onerror = (e) => {
      if (e.error === 'no-speech') return
      console.log('Speech error:', e.error)
    }

    rec.onend = () => {
      // Auto restart if still in listening phase
      if (phaseRef.current === 'listening' && isRecordingRef.current) {
        try { rec.start() } catch(e) {}
      }
    }

    recognitionRef.current = rec
    rec.start()
  }

  const handleStopRecording = () => {
    if (!isRecordingRef.current) return
    isRecordingRef.current = false
    clearInterval(timerRef.current)

    if (recognitionRef.current) {
      clearInterval(recognitionRef.current._eyeInterval)
      recognitionRef.current.onend = null
      try { recognitionRef.current.stop() } catch(e) {}
    }

    setLiveTranscript('')
    setPhase('processing')
    phaseRef.current = 'processing'
    evaluateAnswer()
  }

  const evaluateAnswer = async () => {
    const currentIndex = currentQRef.current
    const currentQuestion = questions[currentIndex]
    const duration = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 60
    const answerText = transcriptRef.current || 'No answer provided'

    let evalResult = {
      question: currentQuestion.question,
      answer: answerText,
      final_score: 0,
      answer_quality: 0,
      dimensions: { relevance: 0, specificity: 0, correctness: 0, star_structure: 0 },
      eye_contact_score: Math.round(eyeRef.current * 10 * 10) / 10,
      confidence_score: Math.round(confidenceRef.current * 10 * 10) / 10,
      what_was_good: 'Unable to evaluate',
      what_was_missing: 'Unable to evaluate',
      ideal_answer_summary: '',
      improvement_tip: ''
    }

    try {
      const res = await axios.post('http://localhost:8000/evaluate', {
        question: currentQuestion.question,
        answer: answerText,
        job_description: jd,
        difficulty,
        interview_type: type,
        ideal_points: currentQuestion.ideal_answer_points || [],
        eye_contact: eyeRef.current,
        confidence: confidenceRef.current,
        filler_words: fillerRef.current,
        answer_duration: duration
      })
      evalResult = { ...evalResult, ...res.data }
      console.log('Evaluation:', evalResult)
    } catch(e) {
      console.error('Evaluation error:', e)
    }

    const newResults = [...resultsRef.current, evalResult]
    setResults(newResults)
    resultsRef.current = newResults

    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      const avg = newResults.reduce((a, r) => a + (r.final_score || 0), 0) / newResults.length
      try {
        await axios.post('http://localhost:8000/interview/save', {
          user_id: user.id,
          role_name: role_name || 'Interview Session',
          job_description: jd,
          interview_type: type,
          difficulty,
          questions,
          results: newResults,
          overall_score: Math.round(avg * 10) / 10
        })
      } catch(e) { console.log('Save failed:', e) }
      navigate('/scorecard', { state: { results: newResults, avg, jd, type, difficulty } })
    } else {
      setCurrentQ(nextIndex)
    }
  }

  if (!questions) return (
    <div style={{ color: '#fff', padding: 40, background: '#050508', minHeight: '100vh', fontFamily: 'Inter,sans-serif' }}>
      No data. <button onClick={() => navigate('/setup')} style={{ color: '#7c6ef7', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>Go back</button>
    </div>
  )

  const timerColor = timeLeft > 30 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#ef4444'
  const timerPct = (timeLeft / 90) * 100
  const question = questions[currentQ]

  return (
    <div style={{ height: '100vh', background: '#050508', fontFamily: 'Inter,sans-serif', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,8,0.95)', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#7c6ef7,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MockUp</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: i === currentQ ? 24 : 8, height: 8, borderRadius: 4, background: i < currentQ ? '#10b981' : i === currentQ ? '#7c6ef7' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
          <span style={{ fontSize: 13, color: '#60607a', marginLeft: 8 }}>{currentQ + 1}/{questions.length}</span>
        </div>

        <div style={{ position: 'relative', width: 48, height: 48 }}>
          <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" stroke={phase === 'listening' ? timerColor : 'rgba(255,255,255,0.15)'} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: phase === 'listening' ? timerColor : '#60607a' }}>{timeLeft}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>

        {/* Left — webcam */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0d0d14', flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            {phase === 'listening' && (
              <>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fca5a5' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} /> REC
                </motion.div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
                    <span>Eye contact</span><span>{Math.round(eyeContact * 100)}%</span>
                  </div>
                  <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <motion.div animate={{ width: `${eyeContact * 100}%` }} transition={{ duration: 0.8 }}
                      style={{ height: '100%', background: '#7c6ef7', borderRadius: 1 }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {phase === 'listening' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: 36, background: 'rgba(124,110,247,0.05)', borderRadius: 10, border: '1px solid rgba(124,110,247,0.1)', flexShrink: 0 }}>
              {[...Array(18)].map((_, i) => (
                <motion.div key={i}
                  animate={{ height: [3, Math.random() * 22 + 3, 3] }}
                  transition={{ duration: 0.3 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.04 }}
                  style={{ width: 2, background: '#7c6ef7', borderRadius: 1, opacity: 0.7 }} />
              ))}
            </div>
          )}
        </div>

        {/* Right — question + controls */}
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#7c6ef7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Question {currentQ + 1} of {questions.length} · {question?.type}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.55, marginBottom: 12 }}>{question?.question}</div>
              {aiSpeaking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(124,110,247,0.1)', border: '1px solid rgba(124,110,247,0.2)', borderRadius: 100, padding: '5px 12px', fontSize: 12, color: '#9d8ff9' }}>
                  <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: '#7c6ef7' }} />
                  Reading question...
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {(transcript || liveTranscript) && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 14, fontSize: 13, lineHeight: 1.8, color: '#a0a0b8', maxHeight: 160, overflowY: 'auto' }}>
              <span style={{ color: '#e2e2e2' }}>{transcript}</span>
              <span style={{ color: '#555' }}>{liveTranscript}</span>
              {phase === 'listening' && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: '#7c6ef7' }}>|</motion.span>
              )}
            </div>
          )}

          {fillerCount > 0 && phase === 'listening' && (
            <div style={{ fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '5px 10px' }}>
              ⚠️ Filler words: {fillerCount}
            </div>
          )}

          {phase === 'processing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(124,110,247,0.07)', border: '1px solid rgba(124,110,247,0.15)', borderRadius: 10, padding: 14 }}>
              <div style={{ width: 18, height: 18, border: '2px solid rgba(124,110,247,0.3)', borderTop: '2px solid #7c6ef7', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#9d8ff9' }}>Evaluating your answer...</span>
            </motion.div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', gap: 10 }}>
            {phase === 'speaking' && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { window.speechSynthesis.cancel(); setAiSpeaking(false); setPhase('ready'); phaseRef.current = 'ready' }}
                style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#a0a0b8', fontSize: 14, cursor: 'pointer' }}>
                Skip →
              </motion.button>
            )}
            {phase === 'ready' && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleStartRecording}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#7c6ef7,#9d8ff9)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(124,110,247,0.25)' }}>
                🎤 Start Answering
              </motion.button>
            )}
            {phase === 'listening' && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleStopRecording}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                ⏹ Done Answering
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}