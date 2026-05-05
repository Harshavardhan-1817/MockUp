import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Scorecard({ user }) {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { results, avg, jd, type, difficulty } = state || {}

  if (!results) return (
    <div style={{ color: '#1C1917', padding: 40, background: '#FFFBF5', minHeight: '100vh', fontFamily: 'Inter,sans-serif' }}>
      No results found. <button onClick={() => navigate('/dashboard')} style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>Go to dashboard</button>
    </div>
  )

  const getGrade = (score) => {
    if (score >= 8.5) return { grade: 'A+', color: '#059669', bg: '#ECFDF5' }
    if (score >= 7.5) return { grade: 'A', color: '#059669', bg: '#ECFDF5' }
    if (score >= 6.5) return { grade: 'B+', color: '#2563EB', bg: '#EFF6FF' }
    if (score >= 5.5) return { grade: 'B', color: '#2563EB', bg: '#EFF6FF' }
    if (score >= 4.5) return { grade: 'C', color: '#F59E0B', bg: '#FEF3C7' }
    return { grade: 'D', color: '#DC2626', bg: '#FEE2E2' }
  }

  const { grade, color, bg } = getGrade(avg)

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF5', fontFamily: 'Inter,sans-serif', color: '#1C1917' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #E7E5E4', background: 'rgba(255,251,245,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>Mock<span style={{ color: '#059669' }}>Up</span></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/setup')} style={{ padding: '8px 18px', background: '#059669', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Practice again</button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #E7E5E4', borderRadius: 8, color: '#78716C', fontSize: 13, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>

        {/* Overall */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 20, padding: '40px', textAlign: 'center', marginBottom: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 12, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Interview complete</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: bg, marginBottom: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color }}>{grade}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 6, letterSpacing: '-1px' }}>{avg.toFixed(1)} / 10</div>
          <div style={{ fontSize: 14, color: '#A8A29E', marginBottom: 28 }}>Overall score · {type} · {difficulty}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 480, margin: '0 auto' }}>
            {[
              { label: 'Answer quality', val: results.reduce((a, r) => a + (r.answer_quality || 0), 0) / results.length },
              { label: 'Eye contact', val: results.reduce((a, r) => a + (r.eye_contact_score || 0), 0) / results.length },
              { label: 'Confidence', val: results.reduce((a, r) => a + (r.confidence_score || 0), 0) / results.length },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 10, padding: '14px' }}>
                <div style={{ fontSize: 11, color: '#A8A29E', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginBottom: 6 }}>{(val || 0).toFixed(1)}</div>
                <div style={{ height: 4, background: '#E7E5E4', borderRadius: 2 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(val / 10) * 100}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ height: '100%', background: '#059669', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Per question */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Question breakdown</h2>
        {results.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Question {i + 1}</div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: '#1C1917' }}>{r.question}</div>
              </div>
              <div style={{ background: getGrade(r.final_score).bg, borderRadius: 10, padding: '8px 16px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: getGrade(r.final_score).color }}>{(r.final_score || 0).toFixed(1)}</div>
                <div style={{ fontSize: 10, color: getGrade(r.final_score).color }}>/10</div>
              </div>
            </div>

            {r.dimensions && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                {Object.entries(r.dimensions).map(([key, val]) => (
                  <div key={key} style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: '#A8A29E', textTransform: 'capitalize', marginBottom: 4 }}>{key.replace('_', ' ')}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1917' }}>{val}</div>
                    <div style={{ height: 3, background: '#E7E5E4', borderRadius: 2, marginTop: 6 }}>
                      <div style={{ width: `${(val / 10) * 100}%`, height: '100%', background: '#059669', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: r.improvement_tip ? 10 : 0 }}>
              {r.what_was_good && (
                <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#065F46', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What was good</div>
                  <div style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6 }}>{r.what_was_good}</div>
                </div>
              )}
              {r.what_was_missing && (
                <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#991B1B', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What was missing</div>
                  <div style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6 }}>{r.what_was_missing}</div>
                </div>
              )}
            </div>

            {r.improvement_tip && (
              <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '12px 14px', marginBottom: r.ideal_answer_summary ? 10 : 0 }}>
                <div style={{ fontSize: 10, color: '#92400E', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Improvement tip</div>
                <div style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6 }}>{r.improvement_tip}</div>
              </div>
            )}

            {r.ideal_answer_summary && (
              <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#1D4ED8', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ideal answer</div>
                <div style={{ fontSize: 13, color: '#44403C', lineHeight: 1.6 }}>{r.ideal_answer_summary}</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}