'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════
   CLASS DATA
   ═══════════════════════════════════════════════════════════════════ */

interface ClassDef {
  id: string
  name: string
  emoji: string
  ageLabel: string
  time: string
  description: string
  disclaimer?: string
  julyDaily: number
  augustDaily: number
}

const CLASSES: ClassDef[] = [
  {
    id: 'tiny-tots',
    name: 'Tiny Tots',
    emoji: '👶',
    ageLabel: '5 & Under',
    time: '9:00 – 9:45 AM',
    description: 'Explore instruments, sounds, and learn about music in general. A fun introduction to the world of music for our youngest learners.',
    julyDaily: 25,
    augustDaily: 25,
  },
  {
    id: 'kids-5-10',
    name: 'Kids Music',
    emoji: '🎵',
    ageLabel: 'Ages 5–10',
    time: '10:00 – 11:30 AM',
    description: 'A structured class where kids learn different instruments, learn songs as a group, learn techniques on being a musician, and have fun!',
    julyDaily: 25,
    augustDaily: 30,
  },
  {
    id: 'kids-10-17',
    name: 'Kids Music',
    emoji: '🎤',
    ageLabel: 'Ages 10–17',
    time: '11:30 AM – 1:00 PM',
    description: 'A structured class where kids learn different instruments, learn songs as a group, learn techniques on being a musician, and have fun!',
    julyDaily: 25,
    augustDaily: 30,
  },
  {
    id: 'piano',
    name: 'Piano',
    emoji: '🎹',
    ageLabel: 'All Ages',
    time: '1:30 – 2:45 PM',
    description: 'Train to play your favorite songs on piano, learn music theory, and prepare for music in school.',
    disclaimer: 'Child must be able to pay attention and sit still.',
    julyDaily: 25,
    augustDaily: 35,
  },
  {
    id: 'recording',
    name: 'Recording',
    emoji: '🎙️',
    ageLabel: 'All Ages',
    time: '2:45 – 4:00 PM',
    description: 'Learn to record yourself at home and build your artist image.',
    disclaimer: 'Child must be able to pay attention and sit still.',
    julyDaily: 25,
    augustDaily: 40,
  },
]

type PassType = 'daily' | 'weekly' | 'monthly'

const JULY_WEEKS = [
  { label: 'Week 1', range: 'Jun 30 – Jul 3', days: ['Mon Jun 30', 'Tue Jul 1', 'Wed Jul 2', 'Thu Jul 3'] },
  { label: 'Week 2', range: 'Jul 7 – 10', days: ['Mon Jul 7', 'Tue Jul 8', 'Wed Jul 9', 'Thu Jul 10'] },
  { label: 'Week 3', range: 'Jul 14 – 17', days: ['Mon Jul 14', 'Tue Jul 15', 'Wed Jul 16', 'Thu Jul 17'] },
  { label: 'Week 4', range: 'Jul 21 – 24', days: ['Mon Jul 21', 'Tue Jul 22', 'Wed Jul 23', 'Thu Jul 24'] },
  { label: 'Week 5', range: 'Jul 28 – 31', days: ['Mon Jul 28', 'Tue Jul 29', 'Wed Jul 30', 'Thu Jul 31'] },
]

const AUGUST_WEEKS = [
  { label: 'Week 1', range: 'Aug 4 – 7', days: ['Mon Aug 4', 'Tue Aug 5', 'Wed Aug 6', 'Thu Aug 7'] },
  { label: 'Week 2', range: 'Aug 11 – 14', days: ['Mon Aug 11', 'Tue Aug 12', 'Wed Aug 13', 'Thu Aug 14'] },
  { label: 'Week 3', range: 'Aug 18 – 21', days: ['Mon Aug 18', 'Tue Aug 19', 'Wed Aug 20', 'Thu Aug 21'] },
  { label: 'Week 4', range: 'Aug 25 – 28', days: ['Mon Aug 25', 'Tue Aug 26', 'Wed Aug 27', 'Thu Aug 28'] },
]

/* ═══════════════════════════════════════════════════════════════════
   TYPES & PRICING
   ═══════════════════════════════════════════════════════════════════ */

interface StudentEntry {
  name: string
  age: string
  classId: string
}

function getDailyRate(cls: ClassDef, month: 'july' | 'august'): number {
  return month === 'july' ? cls.julyDaily : cls.augustDaily
}

function calcStudentDaily(cls: ClassDef, month: 'july' | 'august', isAdditional: boolean): number {
  const base = getDailyRate(cls, month)
  return isAdditional ? Math.max(base - 5, 0) : base
}

function calcTotal(
  students: StudentEntry[],
  month: 'july' | 'august',
  passType: PassType,
  selectedDays: string[],
): number {
  const numDays = passType === 'daily' ? selectedDays.length : passType === 'weekly' ? 4 : 16

  let total = 0
  students.forEach((s, idx) => {
    const cls = CLASSES.find(c => c.id === s.classId)
    if (!cls) return
    const daily = calcStudentDaily(cls, month, idx > 0)
    let subtotal = daily * numDays
    if (passType === 'weekly') subtotal = subtotal * 0.85
    if (passType === 'monthly') subtotal = subtotal * 0.75
    total += subtotal
  })
  return Math.round(total * 100) / 100
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function EnrollContent() {
  const [month, setMonth] = useState<'july' | 'august'>(() => {
    const now = new Date()
    return now.getMonth() >= 7 ? 'august' : 'july'
  })
  const [passType, setPassType] = useState<PassType>('daily')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedWeek, setSelectedWeek] = useState('')
  const [expandedClass, setExpandedClass] = useState<string | null>(null)

  const [students, setStudents] = useState<StudentEntry[]>([{ name: '', age: '', classId: '' }])

  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [allergies, setAllergies] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [liabilityAgreed, setLiabilityAgreed] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const weeks = month === 'july' ? JULY_WEEKS : AUGUST_WEEKS

  function toggleDay(day: string) {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  function addStudent() {
    setStudents(prev => [...prev, { name: '', age: '', classId: '' }])
  }

  function removeStudent(idx: number) {
    if (students.length <= 1) return
    setStudents(prev => prev.filter((_, i) => i !== idx))
  }

  function updateStudent(idx: number, field: keyof StudentEntry, val: string) {
    setStudents(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }

  const allStudentsValid = students.every(s => s.name && s.age && s.classId)
  const daysValid = passType === 'daily' ? selectedDays.length > 0 : passType === 'weekly' ? !!selectedWeek : true
  const parentValid = parentName && email && phone && emergencyName && emergencyPhone && liabilityAgreed
  const allValid = allStudentsValid && daysValid && parentValid

  const total = useMemo(() => {
    if (!allStudentsValid) return 0
    return calcTotal(students, month, passType, selectedDays)
  }, [students, month, passType, selectedDays, allStudentsValid])

  const breakdown = useMemo(() => {
    return students.map((s, idx) => {
      const cls = CLASSES.find(c => c.id === s.classId)
      if (!cls) return null
      const daily = calcStudentDaily(cls, month, idx > 0)
      const numDays = passType === 'daily' ? selectedDays.length : passType === 'weekly' ? 4 : 16
      let subtotal = daily * numDays
      if (passType === 'weekly') subtotal = subtotal * 0.85
      if (passType === 'monthly') subtotal = subtotal * 0.75
      return {
        name: s.name || `Student ${idx + 1}`,
        className: cls.name,
        daily,
        fullDaily: getDailyRate(cls, month),
        isDiscounted: idx > 0,
        numDays,
        subtotal: Math.round(subtotal * 100) / 100,
      }
    }).filter(Boolean)
  }, [students, month, passType, selectedDays])

  function getDaysSummary(): string {
    if (passType === 'daily') return selectedDays.join(', ')
    if (passType === 'weekly') return selectedWeek
    return `All ${month === 'july' ? 'July' : 'August'} (Mon–Thu)`
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!allValid) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: students.map((s, idx) => {
            const cls = CLASSES.find(c => c.id === s.classId)!
            return {
              name: s.name,
              age: s.age,
              classId: s.classId,
              className: cls.name,
              classTime: cls.time,
              dailyRate: calcStudentDaily(cls, month, idx > 0),
            }
          }),
          month,
          passType,
          selectedDays: passType === 'daily' ? selectedDays : passType === 'weekly' ? [selectedWeek] : ['Full Month'],
          parentName,
          email,
          phone,
          allergies,
          emergencyName,
          emergencyPhone,
          total,
        }),
      })

      const data = await res.json()
      if (data.url) {
        try {
          // Create one Airtable record per student so every child shows up
          await Promise.all(students.map(async (s) => {
            const cls = CLASSES.find(c => c.id === s.classId)
            await fetch('/api/lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: parentName, email, phone,
                studentName: s.name,
                studentAge: s.age,
                source: 'enrollment-page',
                status: 'New Lead',
                interests: cls?.name || s.classId,
                allergies: allergies || 'None',
                emergencyContactName: emergencyName,
                emergencyContactPhone: emergencyPhone,
                liabilityAgreed,
                discoveryWeek: getDaysSummary(),
                timeSlot: cls?.time || '',
              }),
            })
          }))
        } catch { /* non-blocking */ }
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  /* ═══ STYLES (shared) ═══ */
  const cardBg = 'rgba(255,255,255,0.03)'
  const cardBorder = 'rgba(255,255,255,0.08)'
  const goldAccent = '#F0C850'
  const inputStyle: React.CSSProperties = {
    background: '#fff',
    color: '#1a1a2e',
    border: '1px solid rgba(240,200,80,0.25)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  }

  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>

      {/* ── Header ── */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-bold" style={{ color: goldAccent, fontFamily: "'Playfair Display', serif" }}>
          BASMA
        </Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition">← Home</Link>
      </nav>

      {/* ── Location ── */}
      <div className="text-center py-2.5 text-sm" style={{ background: 'rgba(251,191,36,0.08)', borderTop: '1px solid rgba(251,191,36,0.15)', borderBottom: '1px solid rgba(251,191,36,0.15)' }}>
        <span className="text-yellow-400 font-semibold">📍 Synergy Dance</span>
        <span className="text-white/50"> · 9512 W Flamingo Rd STE 100, Las Vegas</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

        <h1 className="text-3xl font-bold text-center mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Enroll Now
        </h1>
        <p className="text-white/40 text-center text-sm mb-10">Mon – Thu · Starting June 29</p>

        {/* ════════════════════════════════════════════════════
            1. CHOOSE A CLASS
            ════════════════════════════════════════════════════ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4" style={{ color: goldAccent }}>1 · Classes</h2>

          <div className="grid gap-3">
            {CLASSES.map(cls => {
              const price = getDailyRate(cls, month)
              const isExpanded = expandedClass === cls.id
              return (
                <div
                  key={cls.id}
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <span className="text-2xl">{cls.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-white text-sm">{cls.name}</span>
                        <span className="text-white/30 text-xs">{cls.ageLabel}</span>
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">{cls.time}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-lg" style={{ color: goldAccent }}>${price}</div>
                      <div className="text-white/30 text-[10px]">per day</div>
                    </div>
                    <button
                      onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                      className="text-white/30 hover:text-white/60 transition text-xs ml-1 shrink-0"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      <p className="text-white/50 text-sm leading-relaxed">{cls.description}</p>
                      {cls.disclaimer && (
                        <p className="text-amber-400/70 text-xs mt-2">⚠️ {cls.disclaimer}</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Discount note */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500/60" /> 15% off weekly
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500/80" /> 25% off monthly
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500/60" /> $5 off per additional child
            </span>
          </div>
        </section>

        <form onSubmit={handleCheckout}>

          {/* ════════════════════════════════════════════════════
              2. MONTH & DAYS
              ════════════════════════════════════════════════════ */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: goldAccent }}>2 · When</h2>

            {/* Month toggle */}
            <div className="flex gap-2 mb-5">
              {(['july', 'august'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMonth(m); setSelectedDays([]); setSelectedWeek('') }}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${month === m ? 'text-black shadow' : 'text-white/50 hover:bg-white/5'}`}
                  style={month === m ? { background: goldAccent } : { background: cardBg, border: `1px solid ${cardBorder}` }}
                >
                  {m === 'july' ? 'July · $25/day all classes' : 'August · Tiered pricing'}
                </button>
              ))}
            </div>

            {/* Pass type */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {([
                { type: 'daily' as PassType, label: 'Pick Days', tag: '' },
                { type: 'weekly' as PassType, label: 'Weekly', tag: '15% off' },
                { type: 'monthly' as PassType, label: 'Monthly', tag: '25% off' },
              ]).map(opt => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => { setPassType(opt.type); setSelectedDays([]); setSelectedWeek('') }}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${passType === opt.type ? 'text-yellow-400 border-yellow-500/40' : 'text-white/50 hover:text-white/70'}`}
                  style={{
                    background: passType === opt.type ? 'rgba(251,191,36,0.08)' : cardBg,
                    border: `1px solid ${passType === opt.type ? 'rgba(251,191,36,0.3)' : cardBorder}`,
                  }}
                >
                  {opt.label}
                  {opt.tag && <span className="block text-[10px] text-green-400 mt-0.5">{opt.tag}</span>}
                </button>
              ))}
            </div>

            {/* Day picker */}
            {passType === 'daily' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weeks.map(week => (
                  <div key={week.label}>
                    <div className="text-[10px] text-white/30 font-semibold mb-1.5 uppercase tracking-wider">{week.label} · {week.range}</div>
                    <div className="space-y-1">
                      {week.days.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedDays.includes(day) ? 'text-yellow-400' : 'text-white/50'}`}
                          style={{
                            background: selectedDays.includes(day) ? 'rgba(251,191,36,0.1)' : cardBg,
                            border: `1px solid ${selectedDays.includes(day) ? 'rgba(251,191,36,0.3)' : cardBorder}`,
                          }}
                        >
                          {selectedDays.includes(day) ? '✓ ' : ''}{day}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {passType === 'weekly' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {weeks.map(week => (
                  <button
                    key={week.label}
                    type="button"
                    onClick={() => setSelectedWeek(`${week.label}: ${week.range}`)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedWeek === `${week.label}: ${week.range}` ? 'text-yellow-400' : 'text-white/50'}`}
                    style={{
                      background: selectedWeek === `${week.label}: ${week.range}` ? 'rgba(251,191,36,0.1)' : cardBg,
                      border: `1px solid ${selectedWeek === `${week.label}: ${week.range}` ? 'rgba(251,191,36,0.3)' : cardBorder}`,
                    }}
                  >
                    <div className="font-semibold">{week.label}</div>
                    <div className="text-xs text-white/30">{week.range}</div>
                  </button>
                ))}
              </div>
            )}

            {passType === 'monthly' && (
              <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <p className="text-sm text-green-400">✨ All {month === 'july' ? 'July' : 'August'} classes (Mon–Thu every week) at 25% off</p>
              </div>
            )}
          </section>

          {/* ════════════════════════════════════════════════════
              3. STUDENTS
              ════════════════════════════════════════════════════ */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: goldAccent }}>3 · Students</h2>
              <button type="button" onClick={addStudent} className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold">
                + Add Child
              </button>
            </div>

            <div className="space-y-3">
              {students.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/60">
                      Child {idx + 1}
                      {idx > 0 && <span className="text-green-400 text-xs ml-2">$5 off</span>}
                    </span>
                    {idx > 0 && (
                      <button type="button" onClick={() => removeStudent(idx)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={s.name}
                      onChange={e => updateStudent(idx, 'name', e.target.value)}
                      placeholder="Name"
                      style={inputStyle}
                    />
                    <input
                      value={s.age}
                      onChange={e => updateStudent(idx, 'age', e.target.value)}
                      placeholder="Age"
                      type="number"
                      min="1"
                      max="99"
                      style={inputStyle}
                    />
                    <select
                      value={s.classId}
                      onChange={e => updateStudent(idx, 'classId', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Class…</option>
                      {CLASSES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.name} ({c.ageLabel}) · ${getDailyRate(c, month)}/day
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              4. PARENT INFO
              ════════════════════════════════════════════════════ */}
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: goldAccent }}>4 · Parent Info</h2>

            <div className="p-5 rounded-xl space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Full Name *</label>
                  <input required value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Your name" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Phone *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Email *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1">Allergies</label>
                <input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="None" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Emergency Contact *</label>
                  <input required value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Contact name" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Emergency Phone *</label>
                  <input required type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="(555) 123-4567" style={inputStyle} />
                </div>
              </div>

              {/* Liability */}
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={liabilityAgreed} onChange={e => setLiabilityAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-yellow-400" />
                  <span className="text-xs text-white/50">
                    I grant permission for my child to participate in BASMA activities. I release BASMA, its instructors, and staff from any liability for injuries. I authorize emergency medical treatment if I cannot be reached. *
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              5. SUMMARY & PAY
              ════════════════════════════════════════════════════ */}
          {allStudentsValid && daysValid && (
            <section className="mb-6 p-5 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <h2 className="text-sm font-bold mb-3" style={{ color: goldAccent }}>Summary</h2>
              <div className="space-y-1.5 text-sm">
                {breakdown.map((b, i) => b && (
                  <div key={i} className="flex justify-between">
                    <span className="text-white/60">
                      {b.name} · {b.className}
                      {b.isDiscounted && <span className="text-green-400 text-xs ml-1">(-$5)</span>}
                      <span className="text-white/25 text-xs ml-1">× {b.numDays}d</span>
                      {passType === 'weekly' && <span className="text-green-400 text-xs ml-1">-15%</span>}
                      {passType === 'monthly' && <span className="text-green-400 text-xs ml-1">-25%</span>}
                    </span>
                    <span className="text-white font-medium">${b.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-lg" style={{ color: goldAccent }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !allValid}
            className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: allValid ? `linear-gradient(90deg, ${goldAccent}, #FFE07A)` : 'rgba(255,255,255,0.08)', color: allValid ? '#0D0118' : 'rgba(255,255,255,0.3)' }}
          >
            {loading ? 'Processing…' : allStudentsValid && daysValid ? `Pay $${total.toFixed(2)}` : 'Complete all fields to pay'}
          </button>
          <p className="text-center text-white/25 text-xs mt-3">Secure payment via Stripe · Card or Klarna</p>
        </form>
      </div>

      <footer className="text-center py-6 text-white/15 text-xs border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p>© 2026 B.A.S.M.A — Become A Singer Music Academy</p>
        <p className="mt-1">📍 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147</p>
      </footer>
    </main>
  )
}
