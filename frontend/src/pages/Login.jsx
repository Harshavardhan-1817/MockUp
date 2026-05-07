import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    <div style={S.page}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={S.card}>
        <Link to="/" style={S.logo}>Mock<span style={{ color: '#059669' }}>Up</span></Link>
        <h1 style={S.title}>Welcome back</h1>
        <p style={S.sub}>Sign in to continue your interview prep</p>
        <motion.button whileHover={{ background: '#F5F5F4' }} onClick={handleGoogle} style={S.googleBtn}>
          <img src="https://www.google.com/favicon.ico" width="15" style={{ marginRight: 10 }} />
          Continue with Google
        </motion.button>
        <div style={S.divider}><div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} /></div>
        <form onSubmit={handleLogin}>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={S.label}>Password</label>
          <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.error}>{error}</motion.div>}
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={S.btn} type="submit" disabled={loading}>
            {loading ? <span style={S.spinner} /> : 'Sign in →'}
          </motion.button>
        </form>
        <p style={S.link}>No account? <Link to="/signup" style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}>Sign up free</Link></p>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input:focus{outline:none!important;border-color:#059669!important;box-shadow:0 0 0 3px rgba(5,150,105,0.1)!important}`}</style>
    </div>
  )
}

const S = {
  page: { minHeight: '100vh', background: '#FFFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif' },
  card: { background: '#fff', border: '1px solid #E7E5E4', borderRadius: 16, padding: '44px 40px', width: '100%', maxWidth: 420, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  logo: { display: 'block', fontSize: 22, fontWeight: 800, color: '#1C1917', textDecoration: 'none', marginBottom: 28, letterSpacing: '-0.5px' },
  title: { fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 6, letterSpacing: '-0.5px' },
  sub: { fontSize: 14, color: '#78716C', marginBottom: 28 },
  googleBtn: { width: '100%', padding: '12px', background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 10, color: '#1C1917', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, transition: 'background 0.15s' },
  divider: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  divLine: { flex: 1, height: 1, background: '#E7E5E4' },
  divText: { fontSize: 12, color: '#A8A29E' },
  label: { display: 'block', fontSize: 12, color: '#78716C', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: { width: '100%', padding: '11px 14px', background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 8, color: '#1C1917', fontSize: 14, boxSizing: 'border-box', fontFamily: 'Inter,sans-serif', marginBottom: 16, transition: 'all 0.2s' },
  btn: { width: '100%', padding: '13px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  error: { background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991B1B', marginBottom: 14 },
  spinner: { display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  link: { textAlign: 'center', color: '#78716C', fontSize: 13, marginTop: 24 }
}