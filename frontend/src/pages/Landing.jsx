import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '🎯', title: 'JD-specific questions', desc: 'Every question generated from your actual job description — not generic templates.' },
  { icon: '🧠', title: 'Semantic evaluation', desc: 'Evaluated on meaning, structure, and context. Not keyword matching.' },
  { icon: '📡', title: 'RAG benchmarking', desc: 'Your answers compared against real high-quality interview responses.' },
  { icon: '👁️', title: 'Eye contact tracking', desc: 'MediaPipe tracks your gaze in real time and scores your presence.' },
  { icon: '💡', title: 'Hints system', desc: 'Stuck? Reveal structured hints per question. Learn as you practice.' },
  { icon: '📈', title: 'Progress tracking', desc: 'See your score trends, weak areas, and improvement over time.' },
]

export default function Landing({ user }) {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF5', fontFamily: 'Inter,sans-serif', color: '#1C1917' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid #E7E5E4', background: 'rgba(255,251,245,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Mock<span style={{ color: '#059669' }}>Up</span></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <button onClick={() => navigate('/dashboard')} style={btnPrimary}>Dashboard →</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={btnGhost}>Sign in</button>
              <button onClick={() => navigate('/signup')} style={btnPrimary}>Get started free</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 48px 80px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: '#065F46', marginBottom: 32, fontWeight: 500, letterSpacing: '0.05em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI-POWERED INTERVIEW PREPARATION
          </div>
          <h1 style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.0, marginBottom: 24, letterSpacing: '-3px', color: '#1C1917' }}>
            Crack interviews<br /><span style={{ color: '#059669' }}>with AI.</span>
          </h1>
          <p style={{ fontSize: 20, color: '#78716C', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Practice with semantic AI evaluation that understands meaning, structure, and delivery — not just keywords.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/signup')}
              style={{ padding: '15px 36px', background: '#059669', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Start practicing free →
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/login')}
              style={{ padding: '15px 36px', background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 10, color: '#44403C', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
              Sign in
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, paddingTop: 48, borderTop: '1px solid #E7E5E4', flexWrap: 'wrap' }}>
          {[['RAG', 'Benchmark evaluation'], ['5-layer', 'Scoring system'], ['90s', 'Per question timer'], ['Real-time', 'Eye contact scoring']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 13, color: '#A8A29E' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12, color: '#1C1917' }}>
            Everything you need to<br /><span style={{ color: '#059669' }}>ace your next interview</span>
          </h2>
          <p style={{ color: '#78716C', fontSize: 16 }}>Built for developers targeting FAANG, startups, and everything in between.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 1, border: '1px solid #E7E5E4', borderRadius: 16, overflow: 'hidden', background: '#E7E5E4' }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              whileHover={{ background: '#F9FDF9' }}
              style={{ background: '#FFFFFF', padding: '32px', transition: 'background 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#1C1917' }}>{f.title}</div>
              <div style={{ fontSize: 14, color: '#78716C', lineHeight: 1.7 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px 120px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 20, padding: '72px 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 14, letterSpacing: '-1.5px', color: '#1C1917' }}>Ready to start?</h2>
          <p style={{ color: '#78716C', fontSize: 16, marginBottom: 32 }}>Join developers leveling up their interview skills with AI.</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/signup')}
            style={{ padding: '16px 40px', background: '#059669', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Get started free →
          </motion.button>
        </motion.div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}

const btnPrimary = { padding: '10px 22px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const btnGhost = { padding: '10px 22px', background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 8, color: '#44403C', fontSize: 14, cursor: 'pointer' }