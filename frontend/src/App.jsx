import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import InterviewRoom from './pages/InterviewRoom'
import './index.css'
import Scorecard from './pages/Scorecard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050508'}}>
      <div style={{width:40,height:40,border:'3px solid #2a2a3a',borderTop:'3px solid #7c6ef7',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/setup" element={user ? <InterviewSetup user={user} /> : <Navigate to="/login" />} />
        <Route path="/interview" element={user ? <InterviewRoom user={user} /> : <Navigate to="/login" />} />
        <Route path="/scorecard" element={user ? <Scorecard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
