'use client'

import { useState } from 'react'

const JUNE_CLASSES = [
  { id: 'tiny-tots', name: 'Tiny Tots Music & Fun (Ages 2–5)', time: '9:00 – 10:00 AM', color: '#ff69b4', emoji: '🧸' },
  { id: 'kids-5-10', name: 'Kids Music & Fun (Ages 5–10)', time: '10:00 AM – 12:00 PM', color: '#4da6ff', emoji: '🎵' },
  { id: 'kids-10-17', name: 'Kids Music & Fun (Ages 10–17)', time: '12:00 – 2:00 PM', color: '#50c878', emoji: '🎵' },
  { id: 'private-am', name: 'Free 20-Min Private Lesson (Morning)', time: '8:00 – 9:40 AM', color: '#b388ff', emoji: '🎸' },
  { id: 'private-pm', name: 'Free 20-Min Private Lesson (Afternoon)', time: '2:20 – 4:00 PM', color: '#b388ff', emoji: '🎸' },
]

const THIS_WEEK = [
  { id: 'mon', name: 'Mon, June 22' },
  { id: 'tue', name: 'Tue, June 23' },
  { id: 'wed', name: 'Wed, June 24 🍕' },
]

const NEXT_WEEK = [
  { id: 'mon2', name: 'Mon, June 29' },
  { id: 'tue2', name: 'Tue, June 30' },
  { id: 'wed2', name: 'Wed, July 1' },
  { id: 'thu2', name: 'Thu, July 2' },
]

interface Student {
  name: string
  age: string
}

interface Confirmation {
  studentName: string
  selectedClass: string
  thisWeek: string[]
  nextWeek: string[]
}

export default function ConfirmPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [found, setFound] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const lookupEmail = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    setError('')
    setNotFound(false)
    try {
      const res = await fetch(`/api/confirm?email=${encodeURIComponent(email.trim().toLowerCase())}`)
      const data = await res.json()
      if (data.success && data.students?.length > 0) {
        setStudents(data.students)
        setParentName(data.parentName || '')
        setParentPhone(data.parentPhone || '')
        setFound(true)
        setConfirmations(data.students.map((s: Student) => ({
          studentName: s.name,
          selectedClass: '',
          thisWeek: [],
          nextWeek: [],
        })))
      } else {
        setNotFound(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectClass = (idx: number, cls: string) => {
    setConfirmations(prev => {
      const u = [...prev]
      u[idx] = { ...u[idx], selectedClass: cls }
      return u
    })
  }

  const toggleDay = (idx: number, week: 'thisWeek' | 'nextWeek', day: string) => {
    setConfirmations(prev => {
      const u = [...prev]
      const cur = u[idx][week]
      u[idx] = { ...u[idx], [week]: cur.includes(day) ? cur.filter(d => d !== day) : [...cur, day] }
      return u
    })
  }

  const handleSubmit = async () => {
    const valid = confirmations.filter(c => c.selectedClass && (c.thisWeek.length > 0 || c.nextWeek.length > 0))
    if (valid.length === 0) {
      setError('Please select a class and at least one day for each student.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const allConf: Array<{ studentName: string; className: string; daysAttending: string[] }> = []
      for (const c of valid) {
        if (c.thisWeek.length > 0) {
          allConf.push({ studentName: c.studentName, className: c.selectedClass, daysAttending: c.thisWeek.map(d => `${d} (this week)`) })
        }
        if (c.nextWeek.length > 0) {
          allConf.push({ studentName: c.studentName, className: c.selectedClass, daysAttending: c.nextWeek.map(d => `${d} (last week of June)`) })
        }
      }
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentEmail: email.trim().toLowerCase(), parentName, parentPhone, confirmations: allConf }),
      })
      const data = await res.json()
      if (data.success) setSubmitted(true)
      else setError('Failed to confirm. Please call us at (702) 788-7369.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 500, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 28, color: '#ffd700', marginBottom: 12 }}>You&apos;re All Set!</h1>
          <p style={{ fontSize: 16, color: '#c0c0d0', lineHeight: 1.7, marginBottom: 24 }}>
            Thank you for confirming! We can&apos;t wait to see your family. 🎶
          </p>
          <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#ffd700' }}>
              🍕 <strong>Pizza Day — Wednesday, June 24!</strong><br />
              ❌ <strong>No school — Thursday, June 25</strong><br />
              📅 <strong>Last week of June:</strong> Mon–Thu, June 29 – July 2
            </p>
          </div>
          <p style={{ fontSize: 14, color: '#c0c0d0', marginBottom: 20 }}>
            📸 Follow us on Instagram!<br />
            <a href="https://www.instagram.com/becomeasingermusicacademy?igsh=MWw1MGNtczNkOW5oaw==" style={{ color: '#c9a84c' }}>@becomeasingermusicacademy</a>
          </p>
          <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>
            Back to BASMA Academy
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 100%)', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4a0e78, #1a0533)', padding: '28px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#ffd700', fontFamily: 'Georgia, serif' }}>🎵 Confirm Attendance</h1>
        <p style={{ margin: '6px 0 0', color: '#e0d0ff', fontSize: 14 }}>June FREE Classes — BASMA Academy</p>
      </div>

      {/* Announcements */}
      <div style={{ maxWidth: 540, margin: '20px auto', padding: '0 16px' }}>
        <div style={{ background: 'rgba(80,200,120,0.08)', border: '1px solid rgba(80,200,120,0.25)', borderRadius: 12, padding: 16, marginBottom: 12, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 16, color: '#50c878', fontWeight: 'bold' }}>🎉 All June classes are FREE!</p>
        </div>
        <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12, padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#d0d0e0', lineHeight: 1.8 }}>
            🍕 <strong style={{ color: '#ffd700' }}>Pizza Day</strong> — Wednesday, June 24<br />
            ❌ <strong style={{ color: '#ff6b6b' }}>No School</strong> — Thursday, June 25<br />
            📅 <strong style={{ color: '#50c878' }}>Last week of June:</strong> Mon–Thu, June 29 – July 2
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '0 16px 48px' }}>
        {/* Email Lookup */}
        {!found && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 18, color: '#e0e0e0' }}>Enter your email to confirm</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookupEmail()}
                placeholder="parent@email.com"
                style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 16, outline: 'none' }}
              />
              <button onClick={lookupEmail} disabled={loading || !email.includes('@')} style={{ padding: '14px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f', fontWeight: 'bold', fontSize: 14, opacity: loading ? 0.6 : 1 }}>
                {loading ? '...' : 'Look Up'}
              </button>
            </div>
            {notFound && (
              <div style={{ marginTop: 16, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: 20 }}>
                <p style={{ margin: '0 0 8px', fontSize: 15, color: '#ff6b6b', fontWeight: 'bold' }}>Email not found</p>
                <p style={{ margin: '0 0 14px', fontSize: 14, color: '#c0c0d0' }}>Please complete registration before attending class:</p>
                <a href="/enroll" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: 14 }}>
                  Complete Registration →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Student Cards */}
        {found && (
          <>
            {confirmations.map((conf, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 20, color: '#ffd700' }}>🎵 {students[idx].name} {students[idx].age ? `(Age ${students[idx].age})` : ''}</h3>

                {/* Class */}
                <p style={{ margin: '0 0 8px', fontSize: 14, color: '#a0a0b0', fontWeight: 'bold' }}>Which class? (all FREE in June)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                  {JUNE_CLASSES.map(cls => {
                    const label = `${cls.name} — ${cls.time}`
                    const selected = conf.selectedClass === label
                    return (
                      <button key={cls.id} type="button" onClick={() => selectClass(idx, label)} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: selected ? `2px solid ${cls.color}` : '1px solid rgba(255,255,255,0.1)',
                        background: selected ? `${cls.color}20` : 'transparent', transition: 'all 0.15s',
                      }}>
                        <span style={{ fontSize: 18 }}>{cls.emoji}</span>
                        <div>
                          <div style={{ fontSize: 14, color: selected ? '#fff' : '#c0c0d0', fontWeight: selected ? 600 : 400 }}>{cls.name}</div>
                          <div style={{ fontSize: 12, color: '#888' }}>{cls.time} · FREE</div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* This Week */}
                <p style={{ margin: '0 0 8px', fontSize: 14, color: '#a0a0b0', fontWeight: 'bold' }}>This week (June 22–24):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {THIS_WEEK.map(d => {
                    const sel = conf.thisWeek.includes(d.name)
                    return (
                      <button key={d.id} type="button" onClick={() => toggleDay(idx, 'thisWeek', d.name)} style={{
                        padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, transition: 'all 0.15s',
                        background: sel ? 'linear-gradient(135deg, #c9a84c, #f5d07a)' : 'rgba(255,255,255,0.08)',
                        color: sel ? '#0a0a0f' : '#c0c0d0', fontWeight: sel ? 'bold' : 'normal',
                      }}>
                        {d.name}
                      </button>
                    )
                  })}
                </div>

                {/* Next Week */}
                <p style={{ margin: '0 0 8px', fontSize: 14, color: '#a0a0b0', fontWeight: 'bold' }}>Last week of June (June 29 – July 2):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {NEXT_WEEK.map(d => {
                    const sel = conf.nextWeek.includes(d.name)
                    return (
                      <button key={d.id} type="button" onClick={() => toggleDay(idx, 'nextWeek', d.name)} style={{
                        padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, transition: 'all 0.15s',
                        background: sel ? 'linear-gradient(135deg, #50c878, #7dde9a)' : 'rgba(255,255,255,0.08)',
                        color: sel ? '#0a0a0f' : '#c0c0d0', fontWeight: sel ? 'bold' : 'normal',
                      }}>
                        {d.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {error && <p style={{ color: '#ff6b6b', fontSize: 14, textAlign: 'center', margin: '0 0 12px' }}>{error}</p>}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button onClick={handleSubmit} disabled={submitting} style={{
                padding: '16px 48px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 18,
                background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f',
                fontWeight: 'bold', opacity: submitting ? 0.6 : 1, boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
              }}>
                {submitting ? 'Confirming...' : '✅ Confirm — We\'ll Be There!'}
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#c9a84c' }}>
            📸 <a href="https://www.instagram.com/becomeasingermusicacademy?igsh=MWw1MGNtczNkOW5oaw==" style={{ color: '#c9a84c' }}>Follow us on Instagram @becomeasingermusicacademy</a>
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            🎵 Become A Singer Music Academy · 6787 W Tropicana Ave Suite 260, Las Vegas<br />
            <a href="tel:7027887369" style={{ color: '#c9a84c', textDecoration: 'none' }}>(702) 788-7369</a> · <a href="https://basmaworld.com" style={{ color: '#c9a84c', textDecoration: 'none' }}>basmaworld.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
