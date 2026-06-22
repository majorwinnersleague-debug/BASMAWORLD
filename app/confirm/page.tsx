'use client'

import { useState, useEffect } from 'react'

const CLASSES = [
  { id: 'tiny-tots', name: 'Tiny Tots (Ages 2–5)', time: '9:00 – 10:00 AM', color: '#ff69b4' },
  { id: 'kids-5-10', name: 'Kids Music (Ages 5–10)', time: '10:00 – 11:30 AM', color: '#4da6ff' },
  { id: 'kids-10-17', name: 'Kids Music (Ages 10–17)', time: '11:30 AM – 1:00 PM', color: '#50c878' },
  { id: 'piano', name: 'Piano Class Lecture', time: '1:30 – 2:45 PM', color: '#b388ff' },
  { id: 'teens-recording', name: 'Teens Recording (Teens Only)', time: '2:45 – 4:00 PM', color: '#ffb347' },
]

// This week: Mon/Tue/Wed only (no Thu June 25)
const THIS_WEEK_DAYS = [
  { id: 'monday', name: 'Monday, June 22' },
  { id: 'tuesday', name: 'Tuesday, June 23' },
  { id: 'wednesday', name: 'Wednesday, June 24 🍕 Pizza Day!' },
]

// Next week (last week of June): Mon-Thu
const NEXT_WEEK_DAYS = [
  { id: 'monday', name: 'Monday, June 29' },
  { id: 'tuesday', name: 'Tuesday, June 30' },
  { id: 'wednesday', name: 'Wednesday, July 1' },
  { id: 'thursday', name: 'Thursday, July 2' },
]

interface Student {
  name: string
  age: string
  class: string
  source: string
}

interface StudentConfirmation {
  studentName: string
  className: string
  thisWeekDays: string[]
  nextWeekDays: string[]
}

export default function ConfirmPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [found, setFound] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [confirmations, setConfirmations] = useState<StudentConfirmation[]>([])
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
      if (data.success && data.students && data.students.length > 0) {
        setStudents(data.students)
        setParentName(data.parentName || '')
        setParentPhone(data.parentPhone || '')
        setFound(true)
        // Initialize confirmations
        setConfirmations(data.students.map((s: Student) => ({
          studentName: s.name,
          className: '',
          thisWeekDays: [],
          nextWeekDays: [],
        })))
      } else {
        setFound(false)
        setNotFound(true)
        setStudents([])
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateConfirmation = (index: number, field: string, value: string | string[]) => {
    setConfirmations(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const toggleDay = (index: number, week: 'thisWeekDays' | 'nextWeekDays', day: string) => {
    setConfirmations(prev => {
      const updated = [...prev]
      const current = updated[index][week]
      if (current.includes(day)) {
        updated[index] = { ...updated[index], [week]: current.filter(d => d !== day) }
      } else {
        updated[index] = { ...updated[index], [week]: [...current, day] }
      }
      return updated
    })
  }

  const handleSubmit = async () => {
    // Validate
    const valid = confirmations.filter(c => c.className && (c.thisWeekDays.length > 0 || c.nextWeekDays.length > 0))
    if (valid.length === 0) {
      setError('Please select a class and at least one day for each student.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      // Submit this week and next week as separate entries
      const allConfirmations: Array<{ studentName: string; className: string; daysAttending: string[] }> = []
      for (const c of valid) {
        if (c.thisWeekDays.length > 0) {
          allConfirmations.push({
            studentName: c.studentName,
            className: c.className,
            daysAttending: c.thisWeekDays.map(d => `${d} (June 22-24)`),
          })
        }
        if (c.nextWeekDays.length > 0) {
          allConfirmations.push({
            studentName: c.studentName,
            className: c.className,
            daysAttending: c.nextWeekDays.map(d => `${d} (June 29-July 2)`),
          })
        }
      }

      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: email.trim().toLowerCase(),
          parentName,
          parentPhone,
          confirmations: allConfirmations,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError('Failed to confirm. Please try again or call us at (702) 788-7369.')
      }
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
            Thank you for confirming! We can&apos;t wait to see your family this week. 🎶
          </p>
          <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#ffd700' }}>
              🍕 <strong>Pizza Day is Wednesday!</strong><br />
              ❌ <strong>No school Thursday, June 25</strong><br />
              📅 <strong>Last week of June:</strong> Mon–Thu, June 29 – July 2
            </p>
          </div>
          <a href="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold', fontSize: 14 }}>
            Back to BASMA Academy
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 100%)', color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4a0e78, #1a0533)', padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
        <h1 style={{ margin: 0, fontSize: 28, color: '#ffd700', fontFamily: 'Georgia, serif' }}>🎵 Confirm Attendance</h1>
        <p style={{ margin: '8px 0 0', color: '#e0d0ff', fontSize: 14 }}>BASMA Academy — Summer Music Program</p>
      </div>

      {/* Important Notices */}
      <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: '0 0 8px', fontSize: 15, color: '#ffd700', fontWeight: 'bold' }}>📢 This Week&apos;s Announcements</p>
          <p style={{ margin: 0, fontSize: 14, color: '#d0d0e0', lineHeight: 1.7 }}>
            🍕 <strong style={{ color: '#ffd700' }}>Pizza Day</strong> — Wednesday, June 24!<br />
            ❌ <strong style={{ color: '#ff6b6b' }}>No School</strong> — Thursday, June 25<br />
            📅 <strong style={{ color: '#50c878' }}>Last Week of June</strong> — Mon–Thu, June 29 – July 2
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px 48px' }}>
        {/* Email Lookup */}
        {!found && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, color: '#e0e0e0' }}>Enter your email to confirm</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookupEmail()}
                placeholder="parent@email.com"
                style={{
                  flex: 1, padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 16, outline: 'none',
                }}
              />
              <button
                onClick={lookupEmail}
                disabled={loading || !email.includes('@')}
                style={{
                  padding: '14px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f',
                  fontWeight: 'bold', fontSize: 14, opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '...' : 'Look Up'}
              </button>
            </div>

            {notFound && (
              <div style={{ marginTop: 20, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, padding: 20 }}>
                <p style={{ margin: '0 0 12px', fontSize: 15, color: '#ff6b6b', fontWeight: 'bold' }}>
                  We couldn&apos;t find a registration with that email.
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 14, color: '#c0c0d0', lineHeight: 1.6 }}>
                  Please complete your registration first before attending class:
                </p>
                <a
                  href="/enroll"
                  style={{
                    display: 'inline-block', background: 'linear-gradient(135deg, #c9a84c, #f5d07a)',
                    color: '#0a0a0f', padding: '12px 28px', borderRadius: 8, textDecoration: 'none',
                    fontWeight: 'bold', fontSize: 14,
                  }}
                >
                  Complete Registration →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Student Confirmation Cards */}
        {found && confirmations.map((conf, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 20, color: '#ffd700' }}>
              🎵 {students[idx].name}
            </h3>
            {students[idx].age && (
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#a0a0b0' }}>Age: {students[idx].age}</p>
            )}

            {/* Class Selection */}
            <p style={{ margin: '0 0 10px', fontSize: 14, color: '#c0c0d0', fontWeight: 'bold' }}>Which class?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {CLASSES.map(cls => (
                <label
                  key={cls.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10,
                    border: conf.className === `${cls.name} — ${cls.time}` ? `2px solid ${cls.color}` : '1px solid rgba(255,255,255,0.1)',
                    background: conf.className === `${cls.name} — ${cls.time}` ? `${cls.color}15` : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="radio"
                    name={`class-${idx}`}
                    checked={conf.className === `${cls.name} — ${cls.time}`}
                    onChange={() => updateConfirmation(idx, 'className', `${cls.name} — ${cls.time}`)}
                    style={{ accentColor: cls.color }}
                  />
                  <div>
                    <div style={{ fontSize: 14, color: '#e0e0e0', fontWeight: 500 }}>{cls.name}</div>
                    <div style={{ fontSize: 12, color: '#a0a0b0' }}>{cls.time}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* This Week Days */}
            <p style={{ margin: '0 0 10px', fontSize: 14, color: '#c0c0d0', fontWeight: 'bold' }}>
              📅 This Week <span style={{ color: '#a0a0b0', fontWeight: 'normal' }}>(June 22–24)</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {THIS_WEEK_DAYS.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(idx, 'thisWeekDays', day.name)}
                  style={{
                    padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                    background: conf.thisWeekDays.includes(day.name) ? 'linear-gradient(135deg, #c9a84c, #f5d07a)' : 'rgba(255,255,255,0.08)',
                    color: conf.thisWeekDays.includes(day.name) ? '#0a0a0f' : '#c0c0d0',
                    fontWeight: conf.thisWeekDays.includes(day.name) ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                  }}
                >
                  {day.name}
                </button>
              ))}
            </div>

            {/* Next Week Days */}
            <p style={{ margin: '0 0 10px', fontSize: 14, color: '#c0c0d0', fontWeight: 'bold' }}>
              📅 Last Week of June <span style={{ color: '#a0a0b0', fontWeight: 'normal' }}>(June 29 – July 2)</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {NEXT_WEEK_DAYS.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(idx, 'nextWeekDays', day.name)}
                  style={{
                    padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                    background: conf.nextWeekDays.includes(day.name) ? 'linear-gradient(135deg, #50c878, #7dde9a)' : 'rgba(255,255,255,0.08)',
                    color: conf.nextWeekDays.includes(day.name) ? '#0a0a0f' : '#c0c0d0',
                    fontWeight: conf.nextWeekDays.includes(day.name) ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                  }}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        {found && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            {error && (
              <p style={{ color: '#ff6b6b', fontSize: 14, marginBottom: 12 }}>{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '16px 48px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 18,
                background: 'linear-gradient(135deg, #c9a84c, #f5d07a)', color: '#0a0a0f',
                fontWeight: 'bold', opacity: submitting ? 0.6 : 1, transition: 'all 0.2s',
                boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
              }}
            >
              {submitting ? 'Confirming...' : '✅ Confirm — We\'ll Be There!'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 40, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            🎵 Become A Singer Music Academy · 6787 W Tropicana Ave Suite 260, Las Vegas, NV<br />
            <a href="tel:7027887369" style={{ color: '#c9a84c', textDecoration: 'none' }}>(702) 788-7369</a> · <a href="https://basmaworld.com" style={{ color: '#c9a84c', textDecoration: 'none' }}>basmaworld.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
