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
  disclaimer?: string
  julyDaily: number
  augustDaily: number
}

const CLASSES: ClassDef[] = [
  { id: 'tiny-tots', name: 'Tiny Tots', emoji: '👶', ageLabel: '5 & Under', time: '9:00 – 9:45 AM', julyDaily: 25, augustDaily: 25 },
  { id: 'kids-5-10', name: 'Kids Music', emoji: '🎵', ageLabel: 'Ages 5–10', time: '10:00 – 11:30 AM', julyDaily: 25, augustDaily: 30 },
  { id: 'kids-10-17', name: 'Kids Music', emoji: '🎤', ageLabel: 'Ages 10–17', time: '11:30 AM – 1:00 PM', julyDaily: 25, augustDaily: 30 },
  { id: 'piano', name: 'Piano Class', emoji: '🎹', ageLabel: 'All Ages', time: '1:30 – 2:45 PM', julyDaily: 25, augustDaily: 35, disclaimer: 'Child must be able to pay attention and sit still or will be removed.' },
  { id: 'recording', name: 'Recording Class', emoji: '🎙️', ageLabel: 'All Ages', time: '2:45 – 4:00 PM', julyDaily: 25, augustDaily: 40, disclaimer: 'Child must be able to pay attention and sit still or will be removed.' },
]

const CLASS_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const
type Day = typeof CLASS_DAYS[number]

type PassType = 'daily' | 'weekly' | 'monthly'

const JULY_WEEKS = [
  { label: 'Week 1: Jun 29 – Jul 3', days: ['Mon Jun 30', 'Tue Jul 1', 'Wed Jul 2', 'Thu Jul 3'] },
  { label: 'Week 2: Jul 7 – 10', days: ['Mon Jul 7', 'Tue Jul 8', 'Wed Jul 9', 'Thu Jul 10'] },
  { label: 'Week 3: Jul 14 – 17', days: ['Mon Jul 14', 'Tue Jul 15', 'Wed Jul 16', 'Thu Jul 17'] },
  { label: 'Week 4: Jul 21 – 24', days: ['Mon Jul 21', 'Tue Jul 22', 'Wed Jul 23', 'Thu Jul 24'] },
  { label: 'Week 5: Jul 28 – 31', days: ['Mon Jul 28', 'Tue Jul 29', 'Wed Jul 30', 'Thu Jul 31'] },
]

const AUGUST_WEEKS = [
  { label: 'Week 1: Aug 4 – 7', days: ['Mon Aug 4', 'Tue Aug 5', 'Wed Aug 6', 'Thu Aug 7'] },
  { label: 'Week 2: Aug 11 – 14', days: ['Mon Aug 11', 'Tue Aug 12', 'Wed Aug 13', 'Thu Aug 14'] },
  { label: 'Week 3: Aug 18 – 21', days: ['Mon Aug 18', 'Tue Aug 19', 'Wed Aug 20', 'Thu Aug 21'] },
  { label: 'Week 4: Aug 25 – 28', days: ['Mon Aug 25', 'Tue Aug 26', 'Wed Aug 27', 'Thu Aug 28'] },
]

/* ═══════════════════════════════════════════════════════════════════
   STUDENT TYPE
   ═══════════════════════════════════════════════════════════════════ */

interface StudentEntry {
  name: string
  age: string
  classId: string
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING LOGIC
   ═══════════════════════════════════════════════════════════════════ */

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
  selectedWeek: string,
): number {
  const numDays = passType === 'daily' ? selectedDays.length : passType === 'weekly' ? 4 : 16 // 4 weeks × 4 days

  let total = 0
  students.forEach((s, idx) => {
    const cls = CLASSES.find(c => c.id === s.classId)
    if (!cls) return
    const daily = calcStudentDaily(cls, month, idx > 0)
    let subtotal = daily * numDays
    if (passType === 'weekly') subtotal = subtotal * 0.85 // 15% off
    if (passType === 'monthly') subtotal = subtotal * 0.75 // 25% off
    total += subtotal
  })
  return Math.round(total * 100) / 100
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function EnrollContent() {
  // Step: 'build' (pick class, days, students) → 'checkout' (info + pay)
  const [step, setStep] = useState<'build' | 'checkout'>('build')

  // Selections
  const [month, setMonth] = useState<'july' | 'august'>(() => {
    const now = new Date()
    return now.getMonth() >= 7 ? 'august' : 'july' // Auto-select based on current month
  })
  const [passType, setPassType] = useState<PassType>('daily')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedWeek, setSelectedWeek] = useState('')

  // Students
  const [students, setStudents] = useState<StudentEntry[]>([
    { name: '', age: '', classId: '' },
  ])

  // Parent info
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [allergies, setAllergies] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [liabilityAgreed, setLiabilityAgreed] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Weeks for the selected month
  const weeks = month === 'july' ? JULY_WEEKS : AUGUST_WEEKS

  // Helpers
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

  // Validation
  const allStudentsValid = students.every(s => s.name && s.age && s.classId)
  const daysValid = passType === 'daily' ? selectedDays.length > 0 : passType === 'weekly' ? !!selectedWeek : true
  const buildValid = allStudentsValid && daysValid

  // Price
  const total = useMemo(() => {
    if (!allStudentsValid) return 0
    return calcTotal(students, month, passType, selectedDays, selectedWeek)
  }, [students, month, passType, selectedDays, selectedWeek, allStudentsValid])

  // Price breakdown per student
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

  // Day label for summary
  function getDaysSummary(): string {
    if (passType === 'daily') return selectedDays.join(', ')
    if (passType === 'weekly') return selectedWeek
    return `All ${month === 'july' ? 'July' : 'August'} (Mon–Thu)`
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!liabilityAgreed) return
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
        // Also save lead to Airtable
        try {
          await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: parentName,
              email,
              phone,
              studentName: students.map(s => s.name).join(', '),
              studentAge: students.map(s => s.age).join(', '),
              source: 'enrollment-page',
              status: 'New Lead',
              interests: students.map(s => {
                const cls = CLASSES.find(c => c.id === s.classId)
                return cls?.name || s.classId
              }).join(', '),
              allergies: allergies || 'None',
              emergencyContactName: emergencyName,
              emergencyContactPhone: emergencyPhone,
              liabilityAgreed,
              discoveryWeek: getDaysSummary(),
            }),
          })
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

  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
        <Link href="/" className="text-xl font-bold" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
          BASMA
        </Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition">← Home</Link>
      </nav>

      {/* Location Banner */}
      <div className="text-center py-3 text-sm" style={{ background: 'rgba(251,191,36,0.1)', borderTop: '1px solid rgba(251,191,36,0.2)', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>
        <span className="text-yellow-400 font-semibold">📍 All camps at Synergy Dance</span>
        <span className="text-white/60"> · 9512 W Flamingo Rd STE 100, Las Vegas 89147</span>
        <span className="text-white/40"> · Starting June 29</span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className={`flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'build' ? 'text-black' : 'bg-green-500 text-white'}`}
               style={step === 'build' ? { background: '#F0C850' } : {}}>
            {step === 'build' ? '1' : '✓'}
          </div>
          <span className={`text-sm ${step === 'build' ? 'text-white font-medium' : 'text-white/40'}`}>Build Schedule</span>
        </div>
        <div className="w-10 h-0.5" style={{ background: step === 'checkout' ? '#22c55e' : 'rgba(255,255,255,0.1)' }} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'checkout' ? 'text-black' : 'bg-white/10 text-white/40'}`}
               style={step === 'checkout' ? { background: '#F0C850' } : {}}>
            2
          </div>
          <span className={`text-sm ${step === 'checkout' ? 'text-white font-medium' : 'text-white/40'}`}>Info & Pay</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* ═══ STEP 1: BUILD SCHEDULE ═══ */}
        {step === 'build' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Build Your Schedule
            </h1>
            <p className="text-white/50 text-center mb-8 text-sm">Pick a class, choose your days, and add your students.</p>

            {/* Month Toggle */}
            <div className="flex justify-center gap-2 mb-8">
              {(['july', 'august'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMonth(m); setSelectedDays([]); setSelectedWeek('') }}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${month === m ? 'text-black shadow-lg' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
                  style={month === m ? { background: '#F0C850' } : {}}
                >
                  {m === 'july' ? '🎵 July — $25/day all classes' : '🎵 August — Tiered pricing'}
                </button>
              ))}
            </div>

            {/* Pass Type */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-3 font-medium">How would you like to pay?</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { type: 'daily' as PassType, label: 'Pick Days', desc: 'Choose specific days', icon: '📅' },
                  { type: 'weekly' as PassType, label: 'Weekly Pass', desc: '15% off (Mon–Thu)', icon: '📆' },
                  { type: 'monthly' as PassType, label: 'Monthly Pass', desc: '25% off · Best deal!', icon: '🗓️' },
                ]).map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => { setPassType(opt.type); setSelectedDays([]); setSelectedWeek('') }}
                    className={`p-4 rounded-xl text-left transition-all border ${passType === opt.type ? 'border-yellow-500/60' : 'border-white/5 hover:border-white/15'}`}
                    style={passType === opt.type ? { background: 'rgba(251,191,36,0.08)' } : { background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="text-lg mb-1">{opt.icon}</div>
                    <div className={`text-sm font-semibold ${passType === opt.type ? 'text-yellow-400' : 'text-white/80'}`}>{opt.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Day Selection (for daily pass) */}
            {passType === 'daily' && (
              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-3 font-medium">Which days? <span className="text-white/30">(select all that apply)</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weeks.map(week => (
                    <div key={week.label} className="space-y-1.5">
                      <div className="text-xs text-white/30 font-medium px-1">{week.label}</div>
                      {week.days.map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all border ${selectedDays.includes(day) ? 'border-yellow-500/60 text-yellow-400' : 'border-white/5 text-white/50 hover:border-white/15'}`}
                          style={selectedDays.includes(day) ? { background: 'rgba(251,191,36,0.1)' } : { background: 'rgba(255,255,255,0.02)' }}
                        >
                          {selectedDays.includes(day) ? '✓ ' : ''}{day}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                {selectedDays.length > 0 && (
                  <p className="text-xs text-yellow-400/60 mt-2">{selectedDays.length} day{selectedDays.length > 1 ? 's' : ''} selected</p>
                )}
              </div>
            )}

            {/* Week Selection (for weekly pass) */}
            {passType === 'weekly' && (
              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-3 font-medium">Which week?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weeks.map(week => (
                    <button
                      key={week.label}
                      onClick={() => setSelectedWeek(week.label)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${selectedWeek === week.label ? 'border-yellow-500/60 text-yellow-400' : 'border-white/5 text-white/50 hover:border-white/15'}`}
                      style={selectedWeek === week.label ? { background: 'rgba(251,191,36,0.1)' } : { background: 'rgba(255,255,255,0.02)' }}
                    >
                      {selectedWeek === week.label ? '✓ ' : ''}{week.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly — no day selection needed */}
            {passType === 'monthly' && (
              <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <p className="text-sm text-green-400 font-medium">✨ Monthly pass includes all {month === 'july' ? 'July' : 'August'} classes (Mon–Thu every week) at 25% off!</p>
              </div>
            )}

            {/* Students */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-white/60 font-medium">Students</label>
                <button
                  onClick={addStudent}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold transition"
                >
                  + Add Another Child
                </button>
              </div>

              <div className="space-y-3">
                {students.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/70">
                        {idx === 0 ? '👤 Student 1' : `👤 Student ${idx + 1}`}
                        {idx > 0 && <span className="text-green-400 text-xs ml-2">($5 off daily rate)</span>}
                      </span>
                      {idx > 0 && (
                        <button onClick={() => removeStudent(idx)} className="text-xs text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <input
                        value={s.name}
                        onChange={e => updateStudent(idx, 'name', e.target.value)}
                        placeholder="Child's name"
                        className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                        style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }}
                      />
                      <input
                        value={s.age}
                        onChange={e => updateStudent(idx, 'age', e.target.value)}
                        placeholder="Age"
                        type="number"
                        min="1"
                        max="99"
                        className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                        style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }}
                      />
                      <select
                        value={s.classId}
                        onChange={e => updateStudent(idx, 'classId', e.target.value)}
                        className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                        style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }}
                      >
                        <option value="">Select class…</option>
                        {CLASSES.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.name} ({c.ageLabel}) — {c.time} — ${getDailyRate(c, month)}/day
                          </option>
                        ))}
                      </select>
                    </div>

                    {s.classId && CLASSES.find(c => c.id === s.classId)?.disclaimer && (
                      <p className="text-xs text-amber-400/70 mt-2">
                        ⚠️ {CLASSES.find(c => c.id === s.classId)?.disclaimer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            {allStudentsValid && daysValid && (
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <h3 className="text-sm font-bold text-yellow-400 mb-3">💰 Price Summary</h3>
                <div className="space-y-2">
                  {breakdown.map((b, i) => b && (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/60">
                        {b.name} · {b.className}
                        {b.isDiscounted && <span className="text-green-400 text-xs ml-1">(${b.fullDaily} - $5 = ${b.daily}/day)</span>}
                        {!b.isDiscounted && <span className="text-white/30 text-xs ml-1">(${b.daily}/day)</span>}
                        <span className="text-white/30 text-xs ml-1">× {b.numDays} day{b.numDays > 1 ? 's' : ''}</span>
                        {passType === 'weekly' && <span className="text-green-400 text-xs ml-1">(-15%)</span>}
                        {passType === 'monthly' && <span className="text-green-400 text-xs ml-1">(-25%)</span>}
                      </span>
                      <span className="text-white font-semibold">${b.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-yellow-400 font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={() => { setStep('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={!buildValid}
              className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: buildValid ? 'linear-gradient(90deg, #F0C850, #FFE07A)' : 'rgba(255,255,255,0.1)', color: buildValid ? '#0D0118' : 'rgba(255,255,255,0.3)' }}
            >
              Continue to Checkout · ${total.toFixed(2)} →
            </button>
          </>
        )}

        {/* ═══ STEP 2: INFO & PAY ═══ */}
        {step === 'checkout' && (
          <>
            <button onClick={() => setStep('build')} className="text-sm text-white/50 hover:text-white/80 mb-6 block transition">
              ← Back to Schedule
            </button>

            {/* Order Summary */}
            <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.15)' }}>
              <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>📋 Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">Month:</span><span>{month === 'july' ? 'July 2026' : 'August 2026'}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Pass:</span><span>{passType === 'daily' ? 'Daily Pass' : passType === 'weekly' ? 'Weekly Pass (15% off)' : 'Monthly Pass (25% off)'}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Days:</span><span className="text-right max-w-[60%]">{getDaysSummary()}</span></div>
                {students.map((s, i) => {
                  const cls = CLASSES.find(c => c.id === s.classId)
                  return (
                    <div key={i} className="flex justify-between">
                      <span className="text-white/50">{s.name} (age {s.age}):</span>
                      <span>{cls?.emoji} {cls?.name} · {cls?.time}</span>
                    </div>
                  )
                })}
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="text-yellow-400 font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Parent Info Form */}
            <form onSubmit={handleCheckout}>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Parent / Guardian Info</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Full Name *</label>
                  <input required value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Phone *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/60 mb-1.5">Email *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
              </div>

              {/* Health & Safety */}
              <h3 className="text-sm font-semibold text-white/70 mb-3 mt-6">🏥 Health & Emergency</h3>
              <div className="mb-4">
                <label className="block text-sm text-white/60 mb-1.5">Allergies (if any)</label>
                <input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g. Peanuts, Latex, None"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Emergency Contact *</label>
                  <input required value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Contact name"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Emergency Phone *</label>
                  <input required type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    style={{ background: '#fff', color: '#1a1a2e', border: '1px solid rgba(240,200,80,0.2)' }} />
                </div>
              </div>

              {/* Liability Waiver */}
              <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <h4 className="font-bold mb-2 text-sm text-white">📋 Liability Waiver *</h4>
                <div className="text-xs text-white/50 mb-3 max-h-24 overflow-y-auto">
                  <p>I grant permission for my child to participate in BASMA activities. I release BASMA, its instructors, and staff from any liability for injuries. I authorize emergency medical treatment if I cannot be reached.</p>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={liabilityAgreed} onChange={e => setLiabilityAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-yellow-400" />
                  <span className="text-sm text-white/70">I agree to the liability waiver and confirm all info is accurate.</span>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !liabilityAgreed}
                className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-40"
                style={{ background: 'linear-gradient(90deg, #F0C850, #FFE07A)', color: '#0D0118' }}
              >
                {loading ? 'Processing…' : `Pay $${total.toFixed(2)} →`}
              </button>
              <p className="text-center text-white/30 text-xs mt-3">Secure payment via Stripe · You&apos;ll be redirected</p>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-xs border-t border-white/5">
        <p>© 2026 B.A.S.M.A — Become A Singer Music Academy · <a href="https://basmaworld.com" className="hover:text-white/40">basmaworld.com</a></p>
        <p className="mt-1">📍 Camps at Synergy Dance: 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147</p>
        <p className="mt-0.5">📍 Main: 6787 W Tropicana Ave Suite 260, Las Vegas, NV 89103</p>
      </footer>
    </main>
  )
}
