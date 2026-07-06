'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ═══ CLASS DATA ═══ */
const CLASSES = [
  { id: 'tiny-tots', name: 'Tiny Tots Music & Movement', emoji: '👶', age: 'Ages 5 & Under', time: '9:00 – 9:45 AM', desc: 'An engaging introduction to music through singing, movement, rhythm, storytelling, instruments, and creative play.', julyRate: 25, augustRate: 25 },
  { id: 'kids-music-am', name: 'Kids Music Academy (AM)', emoji: '🎵', age: 'By Skill Level', time: '10:00 – 11:15 AM', desc: 'Students build musical skills through singing, rhythm, movement, music theory, and instrument exploration while learning songs based on the monthly theme.', julyRate: 25, augustRate: 30 },
  { id: 'kids-music-pm', name: 'Kids Music Academy (PM)', emoji: '🎵', age: 'By Skill Level', time: '11:30 AM – 12:45 PM', desc: 'Same curriculum as the morning session with multiple scheduling options for families.', julyRate: 25, augustRate: 30 },
  { id: 'band-academy', name: 'Band Academy', emoji: '🎸', age: 'By Skill Level', time: '1:00 – 2:15 PM', desc: 'Students develop ensemble skills on their instrument of choice — piano, guitar, drums, violin, voice, ukulele, bass, and more. Every student also learns piano fundamentals.', julyRate: 25, augustRate: 35 },
  { id: 'piano', name: 'Piano Fundamentals', emoji: '🎹', age: 'By Skill Level', time: '45 Minutes', desc: 'Focused piano instruction covering note reading, technique, rhythm, ear training, and performance skills. Individual and small-group instruction available.', julyRate: 25, augustRate: 35 },
]

const ALL_DAYS = [
  // July (Week 1 free trial is over — starting from Week 2)
  { day: 'Tue Jul 7', month: 'july' as const, week: 2 },
  { day: 'Wed Jul 8', month: 'july' as const, week: 2 },
  { day: 'Thu Jul 9', month: 'july' as const, week: 2 },
  { day: 'Mon Jul 13', month: 'july' as const, week: 3 },
  { day: 'Tue Jul 14', month: 'july' as const, week: 3 },
  { day: 'Wed Jul 15', month: 'july' as const, week: 3 },
  { day: 'Thu Jul 16', month: 'july' as const, week: 3 },
  { day: 'Mon Jul 20', month: 'july' as const, week: 4 },
  { day: 'Tue Jul 21', month: 'july' as const, week: 4 },
  { day: 'Wed Jul 22', month: 'july' as const, week: 4 },
  { day: 'Thu Jul 23', month: 'july' as const, week: 4 },
  { day: 'Mon Jul 27', month: 'july' as const, week: 5 },
  { day: 'Tue Jul 28', month: 'july' as const, week: 5 },
  { day: 'Wed Jul 29', month: 'july' as const, week: 5 },
  { day: 'Thu Jul 30', month: 'july' as const, week: 5 },
  // August
  { day: 'Mon Aug 3', month: 'august' as const, week: 6 },
  { day: 'Tue Aug 4', month: 'august' as const, week: 6 },
  { day: 'Wed Aug 5', month: 'august' as const, week: 6 },
  { day: 'Thu Aug 6', month: 'august' as const, week: 6 },
  { day: 'Mon Aug 10', month: 'august' as const, week: 7 },
  { day: 'Tue Aug 11', month: 'august' as const, week: 7 },
  { day: 'Wed Aug 12', month: 'august' as const, week: 7 },
  { day: 'Thu Aug 13', month: 'august' as const, week: 7 },
  { day: 'Mon Aug 17', month: 'august' as const, week: 8 },
  { day: 'Tue Aug 18', month: 'august' as const, week: 8 },
  { day: 'Wed Aug 19', month: 'august' as const, week: 8 },
  { day: 'Thu Aug 20', month: 'august' as const, week: 8 },
  { day: 'Mon Aug 24', month: 'august' as const, week: 9 },
  { day: 'Tue Aug 25', month: 'august' as const, week: 9 },
  { day: 'Wed Aug 26', month: 'august' as const, week: 9 },
  { day: 'Thu Aug 27', month: 'august' as const, week: 9 },
]

const WEEK_LABELS: Record<number, string> = {
  2: 'Jul 7 – 9', 3: 'Jul 13 – 16', 4: 'Jul 20 – 23', 5: 'Jul 27 – 30',
  6: 'Aug 3 – 6', 7: 'Aug 10 – 13', 8: 'Aug 17 – 20', 9: 'Aug 24 – 27',
}

/* ═══ COMPONENT ═══ */
export default function EnrollContent() {
  const [step, setStep] = useState(1)

  // Step 1: class
  const [classId, setClassId] = useState('')
  // Step 2: days
  const [pickedDays, setPickedDays] = useState<string[]>([])
  // Step 3: info
  const [children, setChildren] = useState([{ name: '', age: '' }])
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [allergies, setAllergies] = useState('')
  const [waiver, setWaiver] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cls = CLASSES.find(c => c.id === classId)

  function toggleDay(d: string) {
    setPickedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  function selectWeek(week: number) {
    const weekDays = ALL_DAYS.filter(d => d.week === week).map(d => d.day)
    const allSelected = weekDays.every(d => pickedDays.includes(d))
    if (allSelected) {
      setPickedDays(prev => prev.filter(d => !weekDays.includes(d)))
    } else {
      setPickedDays(prev => Array.from(new Set([...prev, ...weekDays])))
    }
  }

  // Pricing
  const pricing = useMemo(() => {
    if (!cls || pickedDays.length === 0) return { perDay: 0, subtotal: 0, discount: '', total: 0 }

    const julyDays = pickedDays.filter(d => ALL_DAYS.find(x => x.day === d)?.month === 'july').length
    const augDays = pickedDays.filter(d => ALL_DAYS.find(x => x.day === d)?.month === 'august').length

    let rawTotal = (julyDays * cls.julyRate) + (augDays * cls.augustRate)
    let discount = ''

    // Check for full weeks → 15% off
    const weeks = new Set(pickedDays.map(d => ALL_DAYS.find(x => x.day === d)?.week).filter(Boolean))
    let fullWeeks = 0
    weeks.forEach(w => {
      const totalDaysInWeek = ALL_DAYS.filter(d => d.week === w).length
      const selectedDaysInWeek = pickedDays.filter(d => ALL_DAYS.find(x => x.day === d)?.week === w).length
      if (selectedDaysInWeek === totalDaysInWeek && totalDaysInWeek >= 3) fullWeeks++
    })

    // All July or all August full month → 25% off
    const allJulyDays = ALL_DAYS.filter(d => d.month === 'july').length
    const allAugDays = ALL_DAYS.filter(d => d.month === 'august').length
    if (julyDays === allJulyDays || augDays === allAugDays) {
      discount = '25% monthly discount'
      rawTotal = rawTotal * 0.75
    } else if (fullWeeks > 0) {
      discount = `15% weekly discount (${fullWeeks} full ${fullWeeks === 1 ? 'week' : 'weeks'})`
      rawTotal = rawTotal * 0.85
    }

    // Multi-child discount
    const totalChildren = children.length
    let finalTotal = 0
    for (let i = 0; i < totalChildren; i++) {
      let childJuly = julyDays * cls.julyRate
      let childAug = augDays * cls.augustRate
      if (i > 0) {
        childJuly = julyDays * Math.max(cls.julyRate - 5, 0)
        childAug = augDays * Math.max(cls.augustRate - 5, 0)
      }
      let childTotal = childJuly + childAug
      if (julyDays === allJulyDays || augDays === allAugDays) childTotal *= 0.75
      else if (fullWeeks > 0) childTotal *= 0.85
      finalTotal += childTotal
    }

    return {
      perDay: cls.julyRate,
      subtotal: (julyDays * cls.julyRate + augDays * cls.augustRate) * totalChildren,
      discount,
      total: Math.round(finalTotal * 100) / 100,
    }
  }, [cls, pickedDays, children.length])

  const infoValid = children.every(c => c.name && c.age) && parentName && email && phone && emergencyName && emergencyPhone && waiver

  const [success, setSuccess] = useState(false)

  async function handlePay() {
    if (!cls || pickedDays.length === 0 || !infoValid || pricing.total === 0) return
    setLoading(true)
    setError('')

    try {
      const julyCount = pickedDays.filter(d => ALL_DAYS.find(x => x.day === d)?.month === 'july').length
      const augCount = pickedDays.filter(d => ALL_DAYS.find(x => x.day === d)?.month === 'august').length
      const month = augCount > julyCount ? 'august' : 'july'

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: children.map((c, idx) => ({
            name: c.name,
            age: c.age,
            classId: cls.id,
            className: cls.name,
            classTime: cls.time,
            dailyRate: idx === 0
              ? (month === 'july' ? cls.julyRate : cls.augustRate)
              : Math.max((month === 'july' ? cls.julyRate : cls.augustRate) - 5, 0),
          })),
          month,
          passType: 'daily',
          selectedDays: pickedDays,
          parentName,
          email,
          phone,
          allergies: allergies || 'None',
          emergencyName,
          emergencyPhone,
          total: pricing.total,
        }),
      })

      const data = await res.json()
      if (data.url) {
        try {
          await Promise.all(children.map(async (c) => {
            await fetch('/api/lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: parentName, email, phone,
                studentName: c.name, studentAge: c.age,
                source: 'enrollment-page', status: 'New Lead',
                interests: cls.name, allergies: allergies || 'None',
                emergencyContactName: emergencyName,
                emergencyContactPhone: emergencyPhone,
                liabilityAgreed: true,
                discoveryWeek: pickedDays.join(', '),
                timeSlot: cls.time,
              }),
            })
          }))
        } catch { /* non-blocking */ }
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  /* ═══ STYLES ═══ */
  const gold = '#c9a84c'
  const inputCss: React.CSSProperties = { background: '#fff', color: '#1a1a2e', border: '1px solid rgba(200,180,100,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none' }

  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118', paddingTop: 'calc(var(--ann-bar-height, 0px) + 60px)' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-lg mx-auto">
        <Link href="/" className="text-lg font-bold" style={{ color: gold, fontFamily: "'Playfair Display', serif" }}>BASMA</Link>
        <Link href="/" className="text-sm text-white/40">← Home</Link>
      </nav>

      {/* ── 🎓 Scholarship Banner ── */}
      {!success && (
        <div className="max-w-lg mx-auto px-6 mb-6">
          <Link href="/scholarship">
            <div
              className="rounded-2xl p-5 md:p-6 text-center cursor-pointer transition hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.1))',
                border: '2px solid rgba(168,85,247,0.3)',
                boxShadow: '0 0 20px rgba(168,85,247,0.1)',
              }}
            >
              <p className="text-2xl mb-1">🎓</p>
              <h2 className="text-purple-300 font-bold text-lg mb-1">
                Scholarship Available — $250/month
              </h2>
              <p className="text-white/50 text-sm">
                Unlimited classes for your entire family. Priority for June program families.
              </p>
              <span className="mt-2 inline-block text-purple-300 text-xs font-bold underline">
                Learn More →
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Progress */}
      {!success && <div className="max-w-lg mx-auto px-6 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ background: s <= step ? gold : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <p className="text-center text-white/30 text-xs mt-2">
          Step {step} of 4: {step === 1 ? 'Pick a Class' : step === 2 ? 'Pick Your Days' : step === 3 ? 'Your Info' : 'Review & Pay'}
        </p>
      </div>}

      <div className="max-w-lg mx-auto px-6 pb-24">

        {/* ═══ PAYMENT SUCCESS ═══ */}
        {success && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: gold }}>
              You&apos;re Registered!
            </h1>
            <p className="text-white/60 mb-2">
              Spot secured for <strong className="text-white">{cls?.name}</strong>
            </p>
            <p className="text-white/40 text-sm mb-1">
              {pickedDays.join(', ')} · {cls?.time}
            </p>
            <p className="text-white/30 text-sm mb-8">
              📍 Synergy Dance · 9512 W Flamingo Rd STE 100
            </p>
            <div className="p-4 rounded-xl mb-6 mx-auto max-w-sm" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <p className="text-green-400 text-sm">✅ See you there!</p>
            </div>
            <Link href="/" className="text-sm font-medium" style={{ color: gold }}>
              ← Back to Home
            </Link>
          </div>
        )}

        {/* ═══ STEP 1: PICK A CLASS ═══ */}
        {!success && step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pick a Class
            </h1>
            <div className="space-y-3">
              {CLASSES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setClassId(c.id); setStep(2) }}
                  className="w-full text-left flex items-center gap-4 p-5 rounded-xl transition hover:scale-[1.01]"
                  style={{
                    background: classId === c.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                    border: classId === c.id ? '2px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white">{c.name} <span className="text-white/30 text-sm font-normal">({c.age})</span></div>
                    <div className="text-white/40 text-sm">{c.time}</div>
                    <div className="text-white/25 text-xs mt-1">{c.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-xl" style={{ color: gold }}>${c.julyRate}</div>
                    <div className="text-white/30 text-[10px]">/day</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-white/20 text-xs mt-4">
              📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas
            </p>
          </div>
        )}

        {/* ═══ STEP 2: PICK YOUR DAYS ═══ */}
        {!success && step === 2 && cls && (() => {
          const selectedWeek = pickedDays.length > 0
            ? ALL_DAYS.find(d => pickedDays.includes(d.day))?.week || 0
            : 0

          // Group weeks by month for the dropdown
          const julyWeeks = [2, 3, 4, 5]
          const augWeeks = [6, 7, 8, 9]

          return (
          <div>
            <h1 className="text-2xl font-bold text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Choose Your Schedule
            </h1>
            <p className="text-center text-white/40 text-sm mb-6">
              {cls.emoji} {cls.name} ({cls.age}) · {cls.time}
            </p>

            {/* ── Quick options ── */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { label: 'Single Day', sub: 'Pick one day', icon: '📅' },
                { label: 'Full Week', sub: '15% off', icon: '📆' },
                { label: 'Full Month', sub: '25% off', icon: '🗓️' },
              ].map((opt, i) => {
                const isActive = i === 0 ? (pickedDays.length === 1)
                  : i === 1 ? (pickedDays.length >= 3 && pickedDays.length <= 4 && new Set(pickedDays.map(d => ALL_DAYS.find(x => x.day === d)?.week)).size === 1)
                  : (pickedDays.length >= 12)
                return (
                  <div
                    key={opt.label}
                    className="text-center p-3 rounded-xl cursor-default"
                    style={{
                      background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="text-lg mb-1">{opt.icon}</div>
                    <div className="text-xs font-semibold text-white">{opt.label}</div>
                    <div className="text-[10px] text-green-400 font-semibold">{opt.sub}</div>
                  </div>
                )
              })}
            </div>

            {/* ── Week selector dropdown ── */}
            <div className="mb-4">
              <label className="text-xs font-bold mb-2 block" style={{ color: gold }}>Select a Week</label>
              <select
                value={selectedWeek || ''}
                onChange={e => {
                  const week = parseInt(e.target.value)
                  if (!week) { setPickedDays([]); return }
                  const weekDays = ALL_DAYS.filter(d => d.week === week).map(d => d.day)
                  setPickedDays(weekDays)
                }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 15,
                  background: '#1a1a2e',
                  color: 'white',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 12,
                  outline: 'none',
                  appearance: 'auto' as React.CSSProperties['appearance'],
                }}
              >
                <option value="">— Choose a week —</option>
                <optgroup label={`☀️ July — $${cls.julyRate}/day`}>
                  {julyWeeks.map(w => (
                    <option key={w} value={w}>Week of {WEEK_LABELS[w]} (Mon–Thu)</option>
                  ))}
                </optgroup>
                <optgroup label={`🎓 August — $${cls.augustRate}/day`}>
                  {augWeeks.map(w => (
                    <option key={w} value={w}>Week of {WEEK_LABELS[w]} (Mon–Thu)</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* ── Days within selected week ── */}
            {selectedWeek > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold" style={{ color: gold }}>
                    Days — {WEEK_LABELS[selectedWeek]}
                  </label>
                  <button
                    type="button"
                    onClick={() => selectWeek(selectedWeek)}
                    className="text-xs font-semibold transition"
                    style={{ color: ALL_DAYS.filter(d => d.week === selectedWeek).every(d => pickedDays.includes(d.day)) ? '#22c55e' : gold }}
                  >
                    {ALL_DAYS.filter(d => d.week === selectedWeek).every(d => pickedDays.includes(d.day))
                      ? '✓ All selected (15% off!)'
                      : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_DAYS.filter(d => d.week === selectedWeek).map(d => {
                    const sel = pickedDays.includes(d.day)
                    const dayName = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    const dateObj = new Date(d.day + ' 2026')
                    const dayOfWeek = dayName[dateObj.getDay()] || d.day.split(' ')[0]
                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => toggleDay(d.day)}
                        className="flex items-center gap-3 p-3 rounded-xl transition"
                        style={{
                          background: sel ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                          border: sel ? '2px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: sel ? gold : 'rgba(255,255,255,0.08)',
                            color: sel ? '#0D0118' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {sel ? '✓' : ''}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold" style={{ color: sel ? 'white' : 'rgba(255,255,255,0.6)' }}>
                            {dayOfWeek}
                          </div>
                          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {d.day}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Add more weeks ── */}
            {selectedWeek > 0 && (
              <div className="mb-4">
                <label className="text-xs font-bold mb-2 block" style={{ color: gold }}>Add Another Week (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {[...julyWeeks, ...augWeeks]
                    .filter(w => w !== selectedWeek)
                    .map(w => {
                      const weekDays = ALL_DAYS.filter(d => d.week === w).map(d => d.day)
                      const isAdded = weekDays.some(d => pickedDays.includes(d))
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setPickedDays(prev => prev.filter(d => !weekDays.includes(d)))
                            } else {
                              setPickedDays(prev => Array.from(new Set([...prev, ...weekDays])))
                            }
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition"
                          style={{
                            background: isAdded ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                            border: isAdded ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)',
                            color: isAdded ? '#22c55e' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {isAdded ? '✓ ' : '+ '}{WEEK_LABELS[w]}
                        </button>
                      )
                    })}
                </div>
              </div>
            )}

            {/* ── Full month option ── */}
            {selectedWeek > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { label: 'All of July', icon: '☀️', month: 'july' as const, weeks: julyWeeks },
                  { label: 'All of August', icon: '🎓', month: 'august' as const, weeks: augWeeks },
                ].map(opt => {
                  const allDaysInMonth = ALL_DAYS.filter(d => d.month === opt.month).map(d => d.day)
                  const allSelected = allDaysInMonth.every(d => pickedDays.includes(d))
                  return (
                    <button
                      key={opt.month}
                      type="button"
                      onClick={() => {
                        if (allSelected) {
                          setPickedDays(prev => prev.filter(d => !allDaysInMonth.includes(d)))
                        } else {
                          setPickedDays(prev => Array.from(new Set([...prev, ...allDaysInMonth])))
                        }
                      }}
                      className="p-3 rounded-xl text-center transition"
                      style={{
                        background: allSelected ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                        border: allSelected ? '2px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="text-lg mb-1">{opt.icon}</div>
                      <div className="text-sm font-bold" style={{ color: allSelected ? '#a855f7' : 'white' }}>{opt.label}</div>
                      <div className="text-[10px] text-green-400 font-bold">25% off!</div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Live price preview */}
            {pickedDays.length > 0 && (
              <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{pickedDays.length} day{pickedDays.length !== 1 ? 's' : ''} selected</span>
                  <span className="font-bold" style={{ color: gold }}>
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
                {pricing.discount && <p className="text-green-400 text-xs mt-1">🎉 {pricing.discount}</p>}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={() => pickedDays.length > 0 && setStep(3)}
                disabled={pickedDays.length === 0}
                className="flex-1 py-3 rounded-full text-sm font-bold transition disabled:opacity-30"
                style={{ background: pickedDays.length > 0 ? gold : 'rgba(255,255,255,0.08)', color: pickedDays.length > 0 ? '#0D0118' : 'rgba(255,255,255,0.3)' }}
              >
                Next →
              </button>
            </div>
          </div>
          )
        })()}

        {/* ═══ STEP 3: YOUR INFO ═══ */}
        {!success && step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Info
            </h1>

            {/* Children */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold" style={{ color: gold }}>Children</h2>
                <button type="button" onClick={() => setChildren(prev => [...prev, { name: '', age: '' }])} className="text-xs font-semibold" style={{ color: gold }}>+ Add Child</button>
              </div>
              {children.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input value={c.name} onChange={e => { const n = [...children]; n[i].name = e.target.value; setChildren(n) }} placeholder="Child's name" style={{ ...inputCss, flex: 2 }} />
                  <input value={c.age} onChange={e => { const n = [...children]; n[i].age = e.target.value; setChildren(n) }} placeholder="Age" type="number" min="1" max="99" style={{ ...inputCss, flex: 1, maxWidth: 70 }} />
                  {i > 0 && (
                    <button type="button" onClick={() => setChildren(prev => prev.filter((_, j) => j !== i))} className="text-red-400 text-xs shrink-0 px-2">✕</button>
                  )}
                </div>
              ))}
              {children.length > 1 && <p className="text-green-400 text-xs mt-1">$5 off per day for each additional child</p>}
            </div>

            {/* Parent */}
            <div className="space-y-3 mb-6">
              <h2 className="text-sm font-bold" style={{ color: gold }}>Parent / Guardian</h2>
              <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Your full name *" style={inputCss} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" style={inputCss} />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone *" style={inputCss} />
              <input value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Allergies (or None)" style={inputCss} />
              <div className="grid grid-cols-2 gap-2">
                <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Emergency contact *" style={inputCss} />
                <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="Emergency phone *" style={inputCss} />
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={waiver} onChange={e => setWaiver(e.target.checked)} className="mt-1 w-4 h-4 accent-yellow-400" />
                <span className="text-xs text-white/40">I grant permission for my child to participate and release BASMA from liability. I authorize emergency medical treatment if needed. *</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={() => infoValid && setStep(4)}
                disabled={!infoValid}
                className="flex-1 py-3 rounded-full text-sm font-bold transition disabled:opacity-30"
                style={{ background: infoValid ? gold : 'rgba(255,255,255,0.08)', color: infoValid ? '#0D0118' : 'rgba(255,255,255,0.3)' }}
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: REVIEW & PAY ═══ */}
        {!success && step === 4 && cls && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Review & Pay
            </h1>

            <div className="rounded-xl p-5 mb-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Class */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cls.emoji}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{cls.name} ({cls.age})</div>
                  <div className="text-white/30 text-xs">{cls.time}</div>
                </div>
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Days */}
              <div>
                <div className="text-white/40 text-xs font-semibold mb-1">DAYS ({pickedDays.length})</div>
                <div className="flex flex-wrap gap-1">
                  {pickedDays.sort((a, b) => ALL_DAYS.findIndex(d => d.day === a) - ALL_DAYS.findIndex(d => d.day === b)).map(d => (
                    <span key={d} className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(201,168,76,0.1)', color: gold }}>{d}</span>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Students */}
              <div>
                <div className="text-white/40 text-xs font-semibold mb-1">STUDENTS ({children.length})</div>
                {children.map((c, i) => (
                  <div key={i} className="text-sm text-white/70">
                    {c.name} (age {c.age})
                    {i > 0 && <span className="text-green-400 text-xs ml-2">$5 off/day</span>}
                  </div>
                ))}
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Parent */}
              <div>
                <div className="text-white/40 text-xs font-semibold mb-1">PARENT</div>
                <div className="text-sm text-white/70">{parentName}</div>
                <div className="text-xs text-white/40">{email} · {phone}</div>
              </div>

              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-2xl font-bold" style={{ color: gold }}>
                  ${pricing.total.toFixed(2)}
                </span>
              </div>
              {pricing.discount && <p className="text-green-400 text-xs">🎉 {pricing.discount}</p>}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                ← Back
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="flex-1 py-4 rounded-full text-base font-bold transition hover:scale-[1.02] disabled:opacity-50"
                style={{ background: `linear-gradient(90deg, ${gold}, #FFE07A)`, color: '#0D0118' }}
              >
                {loading ? 'Processing…' : `Pay $${pricing.total.toFixed(2)}`}
              </button>
            </div>
            <p className="text-center text-white/20 text-xs mt-3">
              Secure payment via Stripe · Card or Klarna
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
