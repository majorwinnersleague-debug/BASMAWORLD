'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface ClassInfo {
  id: string
  name: string
  emoji: string
  ageRange: string
  minAge: number
  maxAge: number
  schedule: string
  days: string
  julyPrice: number
  augustSinglePrice: number
  augustBundlePrice: number
  augustBundleSave: string
  julyStripeLink: string
  augustSingleStripeLink: string
  augustBundleStripeLink: string
  weeklyStripeLink: string
  description: string
  isJuneOnly?: boolean
}

const CLASSES: ClassInfo[] = [
  {
    id: 'discovery-camp-11-17',
    name: 'Discovery Camp',
    emoji: '🌟',
    ageRange: 'Ages 11–17',
    minAge: 11, maxAge: 17,
    schedule: '10:00 AM – 12:00 PM',
    days: 'Mon – Thu',
    julyPrice: 0, augustSinglePrice: 0, augustBundlePrice: 0,
    augustBundleSave: '',
    julyStripeLink: '', augustSingleStripeLink: '', augustBundleStripeLink: '', weeklyStripeLink: '',
    description: 'Piano, voice, performance & dance — an exciting introduction to music. Free trial classes!',
    isJuneOnly: true,
  },
  {
    id: 'discovery-camp-5-10',
    name: 'Discovery Camp',
    emoji: '🌟',
    ageRange: 'Ages 5–10',
    minAge: 5, maxAge: 10,
    schedule: '12:00 – 2:00 PM',
    days: 'Mon – Thu',
    julyPrice: 0, augustSinglePrice: 0, augustBundlePrice: 0,
    augustBundleSave: '',
    julyStripeLink: '', augustSingleStripeLink: '', augustBundleStripeLink: '', weeklyStripeLink: '',
    description: 'Piano, voice, performance & dance — a fun, engaging introduction to music. Free trial classes!',
    isJuneOnly: true,
  },
  {
    id: 'tiny-tots',
    name: 'Tiny Tots Music & Fun',
    emoji: '👶',
    ageRange: 'Ages 2–5',
    minAge: 2, maxAge: 5,
    schedule: '9:00 – 9:45 AM',
    days: 'Mon – Thu',
    julyPrice: 25, augustSinglePrice: 25, augustBundlePrice: 75,
    augustBundleSave: 'save $25',
    julyStripeLink: 'https://buy.stripe.com/cNieVc69Dc4D6Fy9EreEo0g',
    augustSingleStripeLink: 'https://buy.stripe.com/7sY6oGeG96Kj0ha2bZeEo0r',
    augustBundleStripeLink: 'https://buy.stripe.com/8x200i55zd8Hgg8cQDeEo0m',
    weeklyStripeLink: 'https://buy.stripe.com/bJebJ055z3y7e806sfeEo07',
    description: 'A fun, playful introduction to music for our youngest learners!',
  },
  {
    id: 'kids-music-5-10',
    name: 'Kids Music & Fun',
    emoji: '🎵',
    ageRange: 'Ages 5–10',
    minAge: 5, maxAge: 10,
    schedule: '10:00 – 11:30 AM',
    days: 'Mon – Thu',
    julyPrice: 25, augustSinglePrice: 30, augustBundlePrice: 90,
    augustBundleSave: 'save $30',
    julyStripeLink: 'https://buy.stripe.com/28E9ASfKdd8H8NGcQDeEo0h',
    augustSingleStripeLink: 'https://buy.stripe.com/7sY28qfKdgkT4xqcQDeEo0k',
    augustBundleStripeLink: 'https://buy.stripe.com/6oU00iapTc4D7JC7wjeEo0i',
    weeklyStripeLink: 'https://buy.stripe.com/bJebJ055z3y7e806sfeEo07',
    description: 'Piano, voice, performance & dance for younger kids.',
  },
  {
    id: 'kids-music-11-17',
    name: 'Kids Music & Fun',
    emoji: '🎵',
    ageRange: 'Ages 11–17',
    minAge: 11, maxAge: 17,
    schedule: '11:30 AM – 1:00 PM',
    days: 'Mon – Thu',
    julyPrice: 25, augustSinglePrice: 30, augustBundlePrice: 90,
    augustBundleSave: 'save $30',
    julyStripeLink: 'https://buy.stripe.com/28E9ASfKdd8H8NGcQDeEo0h',
    augustSingleStripeLink: 'https://buy.stripe.com/7sY28qfKdgkT4xqcQDeEo0k',
    augustBundleStripeLink: 'https://buy.stripe.com/6oU00iapTc4D7JC7wjeEo0i',
    weeklyStripeLink: 'https://buy.stripe.com/bJebJ055z3y7e806sfeEo07',
    description: 'Piano, voice, performance & dance for older kids and teens.',
  },
  {
    id: 'piano',
    name: 'Piano Class Lecture',
    emoji: '🎹',
    ageRange: 'All Ages',
    minAge: 2, maxAge: 99,
    schedule: '1:30 – 2:45 PM',
    days: 'Mon – Thu',
    julyPrice: 25, augustSinglePrice: 35, augustBundlePrice: 105,
    augustBundleSave: 'save $35',
    julyStripeLink: 'https://buy.stripe.com/fZu14m8hLb0zbZS3g3eEo0l',
    augustSingleStripeLink: 'https://buy.stripe.com/5kQ9ASfKdc4D4xq9EreEo0q',
    augustBundleStripeLink: 'https://buy.stripe.com/6oU5kC55zb0z4xq3g3eEo0o',
    weeklyStripeLink: 'https://buy.stripe.com/bJebJ055z3y7e806sfeEo07',
    description: 'Focused piano instruction for all skill levels.',
  },
  {
    id: 'teens-recording',
    name: 'Teens Recording Studio',
    emoji: '🎙️',
    ageRange: 'Ages 13–17',
    minAge: 13, maxAge: 17,
    schedule: '3:00 – 4:15 PM',
    days: 'Mon – Thu',
    julyPrice: 25, augustSinglePrice: 40, augustBundlePrice: 120,
    augustBundleSave: 'save $40',
    julyStripeLink: 'https://buy.stripe.com/eVq14mcy12u31le4k7eEo0j',
    augustSingleStripeLink: 'https://buy.stripe.com/14A7sKfKd2u35BucQDeEo0p',
    augustBundleStripeLink: 'https://buy.stripe.com/28E8wOapT2u3gg82bZeEo0n',
    weeklyStripeLink: 'https://buy.stripe.com/bJebJ055z3y7e806sfeEo07',
    description: 'Learn recording, production, and performance in a real studio environment!',
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

type Step = 'select-class' | 'details' | 'form'
type Month = 'july' | 'august'
type Package = 'single' | 'bundle' | 'monthly'

export default function EnrollContent() {
  const [step, setStep] = useState<Step>('select-class')
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null)
  const [ageFilter, setAgeFilter] = useState<string>('')
  const [month, setMonth] = useState<Month>('july')
  const [pkg, setPkg] = useState<Package>('single')
  const [quantity, setQuantity] = useState(1)

  // Form fields
  const [studentName, setStudentName] = useState('')
  const [studentAge, setStudentAge] = useState('')
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const age = ageFilter ? parseInt(ageFilter) : null

  const filteredClasses = useMemo(() => {
    if (age === null) return CLASSES
    return CLASSES.filter(c => age >= c.minAge && age <= c.maxAge)
  }, [age])

  const paidClasses = filteredClasses.filter(c => !c.isJuneOnly)
  const freeClasses = filteredClasses.filter(c => c.isJuneOnly)

  function getPrice(): number {
    if (!selectedClass || selectedClass.isJuneOnly) return 0
    if (pkg === 'monthly') return 350
    if (month === 'july') return selectedClass.julyPrice * quantity
    if (pkg === 'bundle') return selectedClass.augustBundlePrice
    return selectedClass.augustSinglePrice * quantity
  }

  function getPriceLabel(): string {
    if (!selectedClass || selectedClass.isJuneOnly) return 'FREE'
    if (pkg === 'monthly') return '$350/month'
    const p = getPrice()
    return `$${p}`
  }

  function getStripeLink(): string {
    if (!selectedClass || selectedClass.isJuneOnly) return ''
    if (pkg === 'monthly') return selectedClass.weeklyStripeLink
    if (month === 'july') {
      const link = selectedClass.julyStripeLink
      if (quantity > 1) return `${link}${link.includes('?') ? '&' : '?'}quantity=${quantity}`
      return link
    }
    if (pkg === 'bundle') return selectedClass.augustBundleStripeLink
    const link = selectedClass.augustSingleStripeLink
    if (quantity > 1) return `${link}${link.includes('?') ? '&' : '?'}quantity=${quantity}`
    return link
  }

  function getMaxQuantity(): number {
    if (pkg === 'bundle') return month === 'july' ? 4 : 3
    return 20
  }

  function selectClass(c: ClassInfo) {
    setSelectedClass(c)
    setQuantity(1)
    if (c.isJuneOnly) {
      setStep('form')
    } else {
      setStep('details')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToForm() {
    if (age !== null && !studentAge) setStudentAge(String(age))
    setStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    if (step === 'form') setStep(selectedClass?.isJuneOnly ? 'select-class' : 'details')
    else if (step === 'details') { setStep('select-class'); setSelectedClass(null) }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClass) return
    setLoading(true)

    const stripeLink = getStripeLink()
    const isFree = selectedClass.isJuneOnly || !stripeLink

    // Save enrollment data (best-effort, non-blocking)
    try {
      await fetch('/api/billy-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName, email, phone, studentName, studentAge,
          className: selectedClass.name,
          ageGroup: selectedClass.ageRange,
          month, packageType: isFree ? 'free' : pkg,
          pricing: getPriceLabel(),
          source: 'enrollment-page',
        }),
      })
    } catch { /* non-blocking */ }

    if (isFree) {
      // Free class — show confirmation
      window.location.href = '/?enrolled=true'
    } else {
      // Paid class — redirect directly to Stripe (no popup!)
      window.location.href = stripeLink
    }
  }

  /* ─── Step indicator ────────────────────────────────────────── */
  const steps = [
    { num: 1, label: 'Choose Class', done: step !== 'select-class' },
    { num: 2, label: 'Schedule', done: step === 'form', show: !selectedClass?.isJuneOnly },
    { num: 3, label: 'Your Info', done: false },
  ].filter(s => s.show !== false)

  const currentStepIdx = step === 'select-class' ? 0 : step === 'details' ? 1 : steps.length - 1

  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
      {/* Top Banner */}
      <div className="text-center py-2 text-sm" style={{ background: 'linear-gradient(90deg, #2D1B4E, #1a0d30)' }}>
        🎵 Summer 2026 Classes at BASMA — Enroll Today! 📍 6787 W Tropicana Ave
      </div>

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
          B.A.S.M.A.
        </Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition">← Back to site</Link>
      </nav>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 py-6">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              i < currentStepIdx ? 'bg-green-500 text-white' :
              i === currentStepIdx ? 'text-white' : 'bg-white/10 text-white/40'
            }`} style={i === currentStepIdx ? { background: '#F0C850', color: '#0D0118' } : i < currentStepIdx ? {} : {}}>
              {i < currentStepIdx ? '✓' : s.num}
            </div>
            <span className={`text-sm ${i === currentStepIdx ? 'text-white font-medium' : 'text-white/40'}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`w-12 h-0.5 mx-1 ${i < currentStepIdx ? 'bg-green-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* ─── STEP 1: Select Class ───────────────────────────── */}
        {step === 'select-class' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Enroll in Summer Classes
              </h1>
              <p className="text-white/50">Enter your child&apos;s age to see classes just for them.</p>
            </div>

            <div className="max-w-xs mx-auto mb-8">
              <label className="block text-sm text-white/60 mb-2">How old is your child?</label>
              <div className="flex gap-2">
                <input
                  type="number" min="1" max="99" placeholder="Enter age"
                  value={ageFilter} onChange={e => setAgeFilter(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                />
                {ageFilter && (
                  <button onClick={() => setAgeFilter('')}
                    className="px-4 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 text-sm">
                    Show All
                  </button>
                )}
              </div>
              {age !== null && <p className="text-sm mt-2" style={{ color: '#F0C850' }}>✨ Showing classes for age {age}</p>}
            </div>

            {/* Free Discovery Camp */}
            {freeClasses.length > 0 && (
              <div className="mb-8 rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #1a3a1a, #0D0118)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">🌟</span>
                  <h2 className="text-2xl font-bold text-green-400">June Discovery Camp</h2>
                  <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">FREE</span>
                </div>
                <p className="text-white/50 text-sm mb-3">FREE · Mon, June 15 – Thu, July 2 · Mon – Thu</p>
                <p className="text-white/60 text-sm mb-4">Piano, voice, performance & dance — a fun introduction to music! No cost, no commitment.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {freeClasses.map(c => (
                    <button key={c.id} onClick={() => selectClass(c)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/40 transition text-left">
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-green-400 text-sm">{c.ageRange}</p>
                        <p className="text-white/40 text-xs">🕐 {c.schedule} · 📅 {c.days}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">FREE — Enroll Now</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paid Classes */}
            {paidClasses.length > 0 && (
              <>
                <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #2D1B4E, #0D0118)', border: '1px solid rgba(240,200,80,0.15)' }}>
                  <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#F0C850' }}>
                    Summer Classes · July & August
                  </h2>
                  <p className="text-white/50 text-sm">⭐ July: All classes $25 · 🎁 August: Buy 3 Get 1 Free</p>
                  <p className="text-white/40 text-xs mt-1">📍 6787 W Tropicana Ave Suite 260 · Mon – Thu</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paidClasses.map(c => (
                    <button key={c.id} onClick={() => selectClass(c)}
                      className="p-5 rounded-2xl text-left transition hover:scale-[1.02]"
                      style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.15)' }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.emoji}</span>
                          <h3 className="font-bold text-lg">{c.name}</h3>
                        </div>
                        <span className="text-white/30">→</span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: '#F0C850' }}>{c.ageRange}</p>
                      <p className="text-white/40 text-xs mb-3">🕐 {c.schedule}<br/>📅 {c.days}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(240,200,80,0.2)', color: '#F0C850' }}>
                          July: ${c.julyPrice}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/5 text-white/50">Aug: ${c.augustSinglePrice}+</span>
                        <span className="px-2 py-1 rounded-full bg-white/5 text-white/50">Monthly: $350</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ─── STEP 2: Schedule ───────────────────────────────── */}
        {step === 'details' && selectedClass && (
          <>
            <button onClick={goBack} className="text-sm text-white/50 hover:text-white/80 mb-6 block">← Back to all classes</button>

            <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.15)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedClass.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedClass.name}</h2>
                  <p style={{ color: '#F0C850' }}>{selectedClass.ageRange}</p>
                </div>
              </div>
              <div className="text-white/50 text-sm mt-3 flex flex-wrap gap-4">
                <span>📅 {selectedClass.days}</span>
                <span>🕐 {selectedClass.schedule}</span>
                <span>📍 6787 W Tropicana Ave, Suite 260</span>
              </div>
            </div>

            {/* Month */}
            <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>Select Month</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => { setMonth('july'); setQuantity(1) }}
                className={`p-4 rounded-xl text-left transition ${month === 'july' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={month === 'july' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <p className="font-bold">July</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>${selectedClass.julyPrice} <span className="text-sm font-normal text-white/50">/class</span></p>
                <p className="text-xs text-white/40 mt-1">⭐ Special pricing!</p>
              </button>
              <button onClick={() => { setMonth('august'); setQuantity(1) }}
                className={`p-4 rounded-xl text-left transition ${month === 'august' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={month === 'august' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <p className="font-bold">August</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>${selectedClass.augustSinglePrice} <span className="text-sm font-normal text-white/50">/class</span></p>
                <p className="text-xs text-white/40 mt-1">🎁 Buy 3 Get 1 Free!</p>
              </button>
            </div>

            {/* Package */}
            <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>Choose Package</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => { setPkg('single'); setQuantity(1) }}
                className={`p-4 rounded-xl text-left transition ${pkg === 'single' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={pkg === 'single' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <p className="font-bold">Single Class</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>
                  ${month === 'july' ? selectedClass.julyPrice : selectedClass.augustSinglePrice}
                </p>
                <p className="text-xs text-white/40">Pay per class</p>
              </button>
              {month === 'august' && (
                <button onClick={() => { setPkg('bundle'); setQuantity(1) }}
                  className={`p-4 rounded-xl text-left transition ${pkg === 'bundle' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                  style={pkg === 'bundle' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                  <p className="font-bold">Bundle (4 classes)</p>
                  <p className="text-lg font-bold" style={{ color: '#F0C850' }}>${selectedClass.augustBundlePrice}</p>
                  <p className="text-xs text-green-400">{selectedClass.augustBundleSave}</p>
                </button>
              )}
              <button onClick={() => { setPkg('monthly'); setQuantity(1) }}
                className={`p-4 rounded-xl text-left transition relative ${pkg === 'monthly' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={pkg === 'monthly' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">POPULAR</span>
                <p className="font-bold">Monthly Pass</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>$350<span className="text-sm font-normal text-white/50">/month</span></p>
                <p className="text-xs text-white/40">All classes · Mon–Thu</p>
              </button>
            </div>

            {/* Quantity (for single classes) */}
            {pkg === 'single' && (
              <div className="mb-6">
                <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>How Many Classes?</h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/60 flex-1">
                    {quantity} class × ${month === 'july' ? selectedClass.julyPrice : selectedClass.augustSinglePrice} each
                  </span>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition">−</button>
                  <span className="text-xl font-bold w-8 text-center" style={{ color: '#F0C850' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(getMaxQuantity(), quantity + 1))}
                    className="w-10 h-10 rounded-full text-lg font-bold hover:opacity-80 transition" style={{ background: '#F0C850', color: '#0D0118' }}>+</button>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(240,200,80,0.08)', border: '1px solid rgba(240,200,80,0.2)' }}>
              <div className="flex justify-between items-center">
                <span className="text-white/60">
                  {month === 'july' ? 'July' : 'August'} · {pkg === 'single' ? 'Single Class' : pkg === 'bundle' ? 'Bundle' : 'Monthly Pass'}
                  {pkg === 'single' && quantity > 1 ? ` × ${quantity}` : ''}
                </span>
                <span className="text-xl font-bold" style={{ color: '#F0C850' }}>{getPriceLabel()}</span>
              </div>
            </div>

            <button onClick={goToForm}
              className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #F0C850, #FFE07A)', color: '#0D0118' }}>
              Continue to Enrollment →
            </button>
          </>
        )}

        {/* ─── STEP 3: Your Info ──────────────────────────────── */}
        {step === 'form' && selectedClass && (
          <>
            <button onClick={goBack} className="text-sm text-white/50 hover:text-white/80 mb-6 block">
              ← Back to {selectedClass.isJuneOnly ? 'classes' : 'schedule'}
            </button>

            {/* Class summary header */}
            <div className="flex justify-between items-center p-4 rounded-xl mb-6" style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.15)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedClass.emoji}</span>
                <div>
                  <span className="font-semibold">{selectedClass.name}</span>
                  <span className="text-white/40 mx-2">·</span>
                  <span style={{ color: '#F0C850' }}>{selectedClass.ageRange}</span>
                </div>
              </div>
              <span className="text-xl font-bold" style={{ color: selectedClass.isJuneOnly ? '#4ade80' : '#F0C850' }}>
                {selectedClass.isJuneOnly ? 'FREE' : getPriceLabel()}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Student & Parent Info</h2>
              <p className="text-white/50 mb-6">
                {selectedClass.isJuneOnly
                  ? "Fill in the details below to enroll in free trial classes."
                  : "Fill in the details below, then you'll be taken to the secure payment page."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Student Name *</label>
                  <input required value={studentName} onChange={e => setStudentName(e.target.value)}
                    placeholder="Child's full name"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Student Age *</label>
                  <input required type="number" min="1" max="99"
                    value={studentAge} onChange={e => setStudentAge(e.target.value)}
                    placeholder={selectedClass.ageRange.replace('Ages ', '')}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/60 mb-1">Parent / Guardian Name *</label>
                <input required value={parentName} onChange={e => setParentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Phone *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>

              {/* Enrollment Summary */}
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.1)' }}>
                <h4 className="font-bold mb-3" style={{ color: '#F0C850' }}>📋 Enrollment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/50">Class:</span><span>{selectedClass.emoji} {selectedClass.name}</span></div>
                  {!selectedClass.isJuneOnly && (
                    <div className="flex justify-between"><span className="text-white/50">Month:</span><span>{month === 'july' ? 'July' : 'August'}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-white/50">Schedule:</span><span>{selectedClass.days}, {selectedClass.schedule}</span></div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Price:</span>
                    <span className={`font-semibold ${selectedClass.isJuneOnly ? 'text-green-400' : ''}`} style={selectedClass.isJuneOnly ? {} : { color: '#F0C850' }}>
                      {getPriceLabel()}
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="text-white/50">Location:</span><span>6787 W Tropicana Ave Suite 260, Las Vegas</span></div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-50"
                style={{ background: selectedClass.isJuneOnly ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #F0C850, #FFE07A)', color: '#0D0118' }}>
                {loading ? 'Processing...' : selectedClass.isJuneOnly ? 'Enroll — It\'s Free! 🎶' : `Proceed to Payment · ${getPriceLabel()} →`}
              </button>
              {!selectedClass.isJuneOnly && (
                <p className="text-center text-white/30 text-xs mt-3">You&apos;ll be redirected to Stripe for secure payment</p>
              )}
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-sm border-t border-white/5">
        <p>© 2026 B.A.S.M.A — Become A Singer Music Academy · <a href="https://basmaworld.com" className="hover:text-white/40">basmaworld.com</a></p>
        <p className="mt-1">📍 6787 W Tropicana Ave Suite 260, Las Vegas, NV 89103</p>
      </footer>
    </main>
  )
}
