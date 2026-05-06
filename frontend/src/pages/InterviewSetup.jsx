import API_BASE from '../config'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function InterviewSetup({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = location.state?.prefill

  const [jd, setJd] = useState(prefill?.jd || '')
  const [type, setType] = useState(prefill?.type || 'behavioral')
  const [difficulty, setDifficulty] = useState(prefill?.difficulty || 'fresher')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (!jd.trim()) { setError('Please paste a job description'); return }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:8000/questions/generate', {
        job_description: jd, interview_type: type, difficulty, count
      })
      navigate('/interview', {
        state: { questions: res.data.questions, role_name: res.data.role_name || 'Interview Session', jd, type, difficulty, user_id: user.id }
      })
    } catch(e) {
      setError('Failed to generate questions. Make sure your backend is running.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF5', fontFamily: 'Inter,sans-serif', color: '#1C1917' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #E7E5E4', background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          Mock<span style={{ color: '#059669' }}>Up</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 8, color: '#78716C', fontSize: 13, cursor: 'pointer' }}>← Dashboard</button>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {prefill && (
            <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '12px 16px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>🔄</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>Retaking: {prefill.role_name || 'Previous interview'}</div>
                <div style={{ fontSize: 12, color: '#78716C' }}>JD and settings pre-filled — edit if needed</div>
              </div>
            </div>
          )}

          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>Set up interview</h1>
          <p style={{ color: '#78716C', fontSize: 15, marginBottom: 40 }}>Paste a job description and configure your session.</p>

          <div style={{ marginBottom: 28 }}>
            <label style={lbl}>Job description <span style={{ color: '#059669' }}>*</span></label>
            <textarea value={jd} onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here — the more detail, the more accurate your questions..."
              style={{ width: '100%', padding: '14px', background: '#fff', border: '1px solid #E7E5E4', borderRadius: 10, color: '#1C1917', fontSize: 14, boxSizing: 'border-box', fontFamily: 'Inter,sans-serif', resize: 'vertical', height: 200, lineHeight: 1.7, outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#059669'}
              onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
            {jd.length > 0 && <div style={{ fontSize: 11, color: '#A8A29E', marginTop: 4 }}>{jd.split(' ').filter(w => w).length} words</div>}
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={lbl}>Interview type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['behavioral', '🧠', 'Behavioral'], ['technical', '💻', 'Technical'], ['mixed', '⚡', 'Mixed']].map(([val, icon, label]) => (
                <motion.button key={val} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setType(val)}
                  style={{ flex: 1, padding: '14px 10px', background: type === val ? '#059669' : '#fff', border: type === val ? '1px solid #059669' : '1px solid #E7E5E4', borderRadius: 10, color: type === val ? '#fff' : '#78716C', fontSize: 14, fontWeight: type === val ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {icon} {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={lbl}>Difficulty level</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['fresher', '🌱', 'Fresher'], ['mid', '🔥', 'Mid-level'], ['senior', '🚀', 'Senior']].map(([val, icon, label]) => (
                <motion.button key={val} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDifficulty(val)}
                  style={{ flex: 1, padding: '14px 10px', background: difficulty === val ? '#059669' : '#fff', border: difficulty === val ? '1px solid #059669' : '1px solid #E7E5E4', borderRadius: 10, color: difficulty === val ? '#fff' : '#78716C', fontSize: 14, fontWeight: difficulty === val ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}>
                  {icon} {label}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={lbl}>Number of questions: <span style={{ color: '#059669', fontWeight: 700 }}>{count}</span></label>
            <input type="range" min={3} max={10} value={count} onChange={e => setCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A8A29E', marginTop: 6 }}>
              <span>3 — quick session</span><span>10 — full interview</span>
            </div>
          </div>

          {error && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B', marginBottom: 20 }}>{error}</div>}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleStart} disabled={loading}
            style={{ width: '100%', padding: '16px', background: loading ? '#E7E5E4' : '#059669', border: 'none', borderRadius: 10, color: loading ? '#A8A29E' : '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 16, height: 16, border: '2px solid #D1D5DB', borderTop: '2px solid #A8A29E', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Generating questions...
              </span>
            ) : 'Launch Mock Interview →'}
          </motion.button>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const lbl = { display: 'block', fontSize: 12, color: '#78716C', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }