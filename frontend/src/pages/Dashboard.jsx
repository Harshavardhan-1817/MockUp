import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const ROLE_COLORS = [
  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8' },
  { bg: '#F5F3FF', border: '#C4B5FD', text: '#5B21B6' },
  { bg: '#FCE7F3', border: '#F9A8D4', text: '#9D174D' },
  { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B' },
]

const getGrade = (score) => {
  if (score >= 8.5) return { grade: 'A+', color: '#059669' }
  if (score >= 7.5) return { grade: 'A', color: '#059669' }
  if (score >= 6.5) return { grade: 'B+', color: '#2563EB' }
  if (score >= 5.5) return { grade: 'B', color: '#2563EB' }
  if (score >= 4.5) return { grade: 'C', color: '#F59E0B' }
  return { grade: 'D', color: '#DC2626' }
}

const formatDate = (d) => {
  const date = new Date(d)
  const now = new Date()
  const diff = Math.floor((now - date) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getInitials = (name, type) => {
  if (!name || name === 'Interview Session') return (type || 'IN').slice(0, 2).toUpperCase()
  const words = name.trim().split(' ').filter(w => w.length > 0)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, avg: 0, best: 0, roles: 0 })
  const [activeTab, setActiveTab] = useState('All')
  const firstName = user.email.split('@')[0]

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/interview/history/${user.id}`)
      const data = res.data.history || []
      setHistory(data)
      if (data.length > 0) {
        const scores = data.map(d => d.overall_score || 0)
        setStats({
          total: data.length,
          avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
          best: Math.max(...scores).toFixed(1),
          roles: new Set(data.map(h => h.role_name).filter(Boolean)).size
        })
      }
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/') }
  const retakeInterview = (item) => navigate('/setup', { state: { prefill: { jd: item.job_description, type: item.interview_type, difficulty: item.difficulty, role_name: item.role_name } } })

  const tabs = ['All', 'Technical', 'Behavioral', 'Mixed']
  const filtered = activeTab === 'All' ? history : history.filter(h => h.interview_type?.toLowerCase() === activeTab.toLowerCase())
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF5', fontFamily: 'Inter,sans-serif', color: '#1C1917' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #E7E5E4', background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>Mock<span style={{ color: '#059669' }}>Up</span></div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Dashboard', 'Practice', 'History'].map(item => (
            <button key={item} onClick={() => item === 'Practice' && navigate('/setup')}
              style={{ padding: '7px 14px', background: item === 'Dashboard' ? '#ECFDF5' : 'transparent', border: item === 'Dashboard' ? '1px solid #6EE7B7' : '1px solid transparent', borderRadius: 8, color: item === 'Dashboard' ? '#065F46' : '#78716C', fontSize: 13, cursor: 'pointer', fontWeight: item === 'Dashboard' ? 600 : 400 }}>
              {item}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #E7E5E4', borderRadius: 100, padding: '6px 14px 6px 6px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ECFDF5', border: '1px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#065F46' }}>
              {firstName[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: '#44403C' }}>{firstName}</span>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 8, color: '#78716C', fontSize: 13, cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 11, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Career dashboard</div>
            <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 4 }}>
              {greeting}, <span style={{ color: '#059669' }}>{firstName}</span>
            </h1>
            <p style={{ color: '#78716C', fontSize: 15 }}>Keep practicing — every session makes you better.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Average readiness</div>
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px', color: stats.total > 0 ? '#059669' : '#E7E5E4' }}>
              {stats.total > 0 ? Math.round(stats.avg * 10) : '--'}<span style={{ fontSize: 22, color: '#E7E5E4' }}>/100</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 40 }}>
          {[
            { label: 'Interviews done', val: stats.total || 0, icon: '🎯', color: '#1C1917' },
            { label: 'Average score', val: stats.total > 0 ? `${stats.avg}/10` : '—', icon: '📊', color: '#059669' },
            { label: 'Best score', val: stats.total > 0 ? `${stats.best}/10` : '—', icon: '🏆', color: '#F59E0B' },
            { label: 'Roles practiced', val: stats.roles || 0, icon: '💼', color: '#1C1917' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 18, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, color: s.color, letterSpacing: '-0.5px' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#A8A29E' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent simulations */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent simulations</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>

            {/* New card */}
            <motion.div whileHover={{ scale: 1.02, borderColor: '#6EE7B7' }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/setup')}
              style={{ background: '#fff', border: '1px dashed #D6D3D1', borderRadius: 12, padding: '24px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 160, transition: 'border-color 0.2s' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, border: '1px dashed #D6D3D1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#A8A29E' }}>+</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1917' }}>New interview</div>
              <div style={{ fontSize: 12, color: '#A8A29E', textAlign: 'center', lineHeight: 1.5 }}>Start a fresh AI session</div>
            </motion.div>

            {history.slice(0, 5).map((item, i) => {
              const color = ROLE_COLORS[i % ROLE_COLORS.length]
              const { grade, color: gradeColor } = getGrade(item.overall_score || 0)
              return (
                <motion.div key={item.id || i} whileHover={{ scale: 1.02, y: -2 }}
                  style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 12, padding: '18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160, position: 'relative', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: color.bg, border: `1px solid ${color.border}`, borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700, color: color.text }}>
                    {(item.overall_score || 0).toFixed(1)}/10
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: color.bg, border: `1px solid ${color.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: color.text }}>
                    {getInitials(item.role_name, item.interview_type)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: '#1C1917', lineHeight: 1.3 }}>{item.role_name || `${item.interview_type} Interview`}</div>
                    <div style={{ fontSize: 11, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{formatDate(item.created_at)}</div>
                  </div>
                  <div style={{ height: 3, background: '#F5F5F4', borderRadius: 2 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.overall_score || 0) * 10}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      style={{ height: '100%', background: gradeColor, borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: color.text, fontWeight: 500 }}>● {item.interview_type}</span>
                    <span style={{ fontSize: 11, color: gradeColor, fontWeight: 700 }}>{grade}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); retakeInterview(item) }}
                    style={{ padding: '7px', background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 7, color: '#44403C', fontSize: 12, cursor: 'pointer', fontWeight: 500, width: '100%', transition: 'all 0.15s' }}>
                    Retake →
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* History table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Interview domains</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '6px 14px', background: activeTab === tab ? '#059669' : '#fff', border: activeTab === tab ? '1px solid #059669' : '1px solid #E7E5E4', borderRadius: 100, color: activeTab === tab ? '#fff' : '#78716C', fontSize: 12, fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ color: '#A8A29E', fontSize: 14, padding: '20px 0' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 12, padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No interviews yet</div>
              <div style={{ fontSize: 13, color: '#78716C', marginBottom: 20 }}>Complete a session to see your performance here.</div>
              <button onClick={() => navigate('/setup')} style={{ padding: '10px 24px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Start now →</button>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', gap: 16, padding: '12px 20px', borderBottom: '1px solid #F5F5F4' }}>
                {['Role', 'Type', 'Score', 'Date', ''].map(h => (
                  <div key={h} style={{ fontSize: 11, color: '#A8A29E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {filtered.map((item, i) => {
                const color = ROLE_COLORS[i % ROLE_COLORS.length]
                const { grade, color: gradeColor } = getGrade(item.overall_score || 0)
                return (
                  <motion.div key={item.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    whileHover={{ background: '#FAFAF9' }}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', gap: 16, padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #F5F5F4' : 'none', alignItems: 'center', transition: 'background 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: color.bg, border: `1px solid ${color.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: color.text, flexShrink: 0 }}>
                        {getInitials(item.role_name, item.interview_type)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1917', marginBottom: 2 }}>{item.role_name || `${item.interview_type} Interview`}</div>
                        <div style={{ fontSize: 11, color: '#A8A29E' }}>{(item.questions?.length || 0)} questions</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#78716C', textTransform: 'capitalize' }}>{item.interview_type}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: gradeColor }}>{(item.overall_score || 0).toFixed(1)}/10</div>
                      <div style={{ height: 3, background: '#F5F5F4', borderRadius: 2, marginTop: 4, width: 60 }}>
                        <div style={{ width: `${(item.overall_score || 0) * 10}%`, height: '100%', background: gradeColor, borderRadius: 2 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#A8A29E' }}>{formatDate(item.created_at)}</div>
                    <button onClick={() => retakeInterview(item)}
                      style={{ padding: '7px 14px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 7, color: '#065F46', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Retake →
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}