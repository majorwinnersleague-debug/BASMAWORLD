'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
  isPrivateTrial?: boolean
}

const CLASSES: ClassInfo[] = [
  {
    id: 'free-private-lesson',
    name: 'Free Private Lesson',
    emoji: '🎤',
    ageRange: 'All Ages',
    minAge: 2, maxAge: 99,
    schedule: new Date().getMonth() === 5 ? '20 min · 8:00–9:40 AM & 2:20–4:00 PM' : '20 min · By Appointment (Fri–Sun)',
    days: new Date().getMonth() === 5 ? 'Mon – Thu' : 'Fri – Sun · By Appointment',
    julyPrice: 0, augustSinglePrice: 0, augustBundlePrice: 0,
    augustBundleSave: '',
    julyStripeLink: '', augustSingleStripeLink: '', augustBundleStripeLink: '', weeklyStripeLink: '',
    description: new Date().getMonth() === 5
      ? 'One free 20-minute private lesson — voice, piano, guitar, or drums. Mon–Thu, pick your slot!'
      : 'One free 20-minute private lesson — voice, piano, guitar, or drums. By appointment, Fri–Sun. We\'ll confirm your time!',
    isPrivateTrial: true,
  },
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

// Map homepage query param class names to our class IDs
const CLASS_PARAM_MAP: Record<string, string> = {
  'tiny-tots': 'tiny-tots',
  'kids-5-10': 'kids-music-5-10',
  'kids-music': 'kids-music-5-10',
  'piano': 'piano',
  'teens-recording': 'teens-recording',
  'discovery-11-17': 'discovery-camp-11-17',
  'discovery-5-10': 'discovery-camp-5-10',
  'free-private': 'free-private-lesson',
  'private-lesson': 'free-private-lesson',
}

export default function EnrollContent() {
  const searchParams = useSearchParams()
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

  // Discovery camp week + time slot
  const [discoveryWeek, setDiscoveryWeek] = useState('')
  const [discoveryTimeSlot, setDiscoveryTimeSlot] = useState('')

  // Private lesson day + time
  const [preferredDay, setPreferredDay] = useState('')
  const [preferredTime, setPreferredTime] = useState('')

  // Determine if we're in June (specific time slots Mon-Thu) or after June (by appointment Fri-Sun)
  const isJune = new Date().getMonth() === 5 // JS months are 0-indexed, 5 = June

  const JUNE_PRIVATE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
  const JUNE_PRIVATE_TIMES = [
    { value: '8:00 AM', label: '8:00 AM', block: 'morning' },
    { value: '8:20 AM', label: '8:20 AM', block: 'morning' },
    { value: '8:40 AM', label: '8:40 AM', block: 'morning' },
    { value: '9:00 AM', label: '9:00 AM', block: 'morning' },
    { value: '9:20 AM', label: '9:20 AM', block: 'morning' },
    { value: '2:20 PM', label: '2:20 PM', block: 'afternoon' },
    { value: '2:40 PM', label: '2:40 PM', block: 'afternoon' },
    { value: '3:00 PM', label: '3:00 PM', block: 'afternoon' },
    { value: '3:20 PM', label: '3:20 PM', block: 'afternoon' },
    { value: '3:40 PM', label: '3:40 PM', block: 'afternoon' },
  ]
  const AFTER_JUNE_DAYS = ['Friday', 'Saturday', 'Sunday']

  // Waiver & health info
  const [allergies, setAllergies] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [liabilityAgreed, setLiabilityAgreed] = useState(false)

  // Paid class week selection
  const [paidWeek, setPaidWeek] = useState('')

  // Live spot counts
  interface SlotInfo { enrolled: number; spotsLeft: number; maxCapacity: number }
  interface WeekSpots { week: string; morning: SlotInfo; midday: SlotInfo; totalEnrolled: number; totalSpotsLeft: number }
  const [campSpots, setCampSpots] = useState<WeekSpots[]>([])

  useEffect(() => {
    fetch('/api/camp-spots')
      .then(r => r.json())
      .then(d => { if (d.weeks) setCampSpots(d.weeks) })
      .catch(() => {})
  }, [])

  function getSpotsForWeek(dates: string): WeekSpots | null {
    return campSpots.find(w => dates.includes(w.week.split(' – ')[0].replace('June ', '').replace('July ', ''))) || 
           campSpots.find(w => w.week === dates) || null
  }

  const DISCOVERY_WEEKS = [
    { value: 'Week 1: June 16–19', label: 'Week 1', dates: 'June 16 – 19' },
    { value: 'Week 2: June 23–26', label: 'Week 2', dates: 'June 23 – 26' },
    { value: 'Week 3: June 30 – July 3', label: 'Week 3', dates: 'June 30 – July 3' },
  ]

  const DISCOVERY_TIME_SLOTS = [
    { value: '10:00 AM – 12:00 PM', label: '10:00 AM – 12:00 PM', icon: '☀️' },
    { value: '12:00 PM – 2:00 PM', label: '12:00 PM – 2:00 PM', icon: '🌤️' },
  ]

  const JULY_WEEKS = [
    { value: 'Week 1: July 7–10', label: 'Week 1', dates: 'July 7 – 10' },
    { value: 'Week 2: July 14–17', label: 'Week 2', dates: 'July 14 – 17' },
    { value: 'Week 3: July 21–24', label: 'Week 3', dates: 'July 21 – 24' },
    { value: 'Week 4: July 28–31', label: 'Week 4', dates: 'July 28 – 31' },
  ]

  const AUGUST_WEEKS = [
    { value: 'Week 1: Aug 4–7', label: 'Week 1', dates: 'Aug 4 – 7' },
    { value: 'Week 2: Aug 11–14', label: 'Week 2', dates: 'Aug 11 – 14' },
    { value: 'Week 3: Aug 18–21', label: 'Week 3', dates: 'Aug 18 – 21' },
    { value: 'Week 4: Aug 25–28', label: 'Week 4', dates: 'Aug 25 – 28' },
  ]

  const paidWeeks = month === 'july' ? JULY_WEEKS : AUGUST_WEEKS

  // Auto-select class and month from URL query params
  useEffect(() => {
    const classParam = searchParams.get('class')
    const monthParam = searchParams.get('month')

    if (classParam) {
      const classId = CLASS_PARAM_MAP[classParam] || classParam
      const foundClass = CLASSES.find(c => c.id === classId)
      if (foundClass) {
        setSelectedClass(foundClass)
        if (monthParam === 'july' || monthParam === 'august') {
          setMonth(monthParam)
        }
        // Skip to details step
        setStep('details')
      }
    }
  }, [searchParams])

  const age = ageFilter ? parseInt(ageFilter) : null

  const filteredClasses = useMemo(() => {
    if (age === null) return CLASSES
    return CLASSES.filter(c => age >= c.minAge && age <= c.maxAge)
  }, [age])

  const paidClasses = filteredClasses.filter(c => !c.isJuneOnly && !c.isPrivateTrial)
  const freeClasses = filteredClasses.filter(c => c.isJuneOnly)
  const privateTrialClass = filteredClasses.find(c => c.isPrivateTrial) || null

  function getPrice(): number {
    if (!selectedClass || selectedClass.isJuneOnly || selectedClass.isPrivateTrial) return 0
    if (pkg === 'monthly') return 350
    if (month === 'july') return selectedClass.julyPrice * quantity
    if (pkg === 'bundle') return selectedClass.augustBundlePrice
    return selectedClass.augustSinglePrice * quantity
  }

  function getPriceLabel(): string {
    if (!selectedClass || selectedClass.isJuneOnly || selectedClass.isPrivateTrial) return 'FREE'
    if (pkg === 'monthly') return '$350/month'
    const p = getPrice()
    return `$${p}`
  }

  function getStripeLink(): string {
    if (!selectedClass || selectedClass.isJuneOnly || selectedClass.isPrivateTrial) return ''
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
    setDiscoveryWeek('')
    setDiscoveryTimeSlot('')
    setPaidWeek('')
    setStep('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToForm() {
    if (age !== null && !studentAge) setStudentAge(String(age))
    setStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    if (step === 'form') setStep('details')
    else if (step === 'details') { setStep('select-class'); setSelectedClass(null) }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClass) return
    setLoading(true)

    const stripeLink = getStripeLink()
    const isFree = selectedClass.isJuneOnly || selectedClass.isPrivateTrial || !stripeLink

    // Save enrollment data to Airtable (best-effort, non-blocking)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parentName,
          email,
          phone,
          studentName,
          studentAge,
          source: selectedClass.isPrivateTrial ? (isJune ? 'free-private-lesson' : 'private-lesson-lead') : isFree ? 'discovery-camp-enrollment' : 'enrollment-page',
          status: selectedClass.isPrivateTrial && !isJune ? 'Private Lesson Lead' : 'New Lead',
          interests: selectedClass.isPrivateTrial ? discoveryTimeSlot : selectedClass.name,
          ...(selectedClass.isPrivateTrial ? { timeSlot: preferredDay && preferredTime ? `${preferredDay} ${preferredTime}` : 'By Appointment', instrument: discoveryTimeSlot, preferredDay, preferredTime } : {}),
          allergies: allergies || 'None',
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
          liabilityAgreed,
          ...(isFree && !selectedClass.isPrivateTrial && discoveryWeek ? { discoveryWeek } : {}),
          ...(isFree && !selectedClass.isPrivateTrial && discoveryTimeSlot ? { timeSlot: discoveryTimeSlot } : {}),
          ...(!isFree && paidWeek ? { discoveryWeek: paidWeek } : {}),
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
    { num: 2, label: selectedClass?.isPrivateTrial ? 'Instrument' : selectedClass?.isJuneOnly ? 'Week & Time' : 'Schedule', done: step === 'form' },
    { num: 3, label: 'Your Info', done: false },
  ]

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

            <div className="max-w-sm mx-auto mb-8">
              <label className="block text-sm text-white/60 mb-2 font-medium">How old is your child?</label>
              <div className="flex gap-2">
                <input
                  type="number" min="1" max="99" placeholder="Enter age..."
                  value={ageFilter} onChange={e => setAgeFilter(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-2xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
                  style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.3)' }}
                />
                {ageFilter && (
                  <button onClick={() => setAgeFilter('')}
                    className="px-5 py-4 rounded-2xl bg-white/10 text-white/70 hover:bg-white/20 text-sm font-medium transition">
                    Show All
                  </button>
                )}
              </div>
              {age !== null && <p className="text-sm mt-3 font-medium" style={{ color: '#F0C850' }}>✨ Showing classes for age {age}</p>}
            </div>

            {/* Free Private Lesson */}
            {privateTrialClass && (
              <div className="mb-8 rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #1a2a3a, #0D0118)', border: '1px solid rgba(96,165,250,0.25)' }}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">🎤</span>
                  <h2 className="text-2xl font-bold text-blue-400">Free Private Lesson</h2>
                  <span className="ml-auto px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">FREE</span>
                </div>
                <p className="text-white/50 text-sm mb-3">20 minutes · 1-on-1 with an instructor · One per student</p>
                <p className="text-white/60 text-sm mb-4">Try a free private lesson — voice, piano, guitar, or drums. No commitment, no cost. See if BASMA is right for you!</p>
                <button onClick={() => selectClass(privateTrialClass)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition text-left w-full">
                  <span className="text-2xl">{privateTrialClass.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{privateTrialClass.name}</h3>
                    <p className="text-blue-400 text-sm">{privateTrialClass.ageRange}</p>
                    <p className="text-white/40 text-xs">🕐 {privateTrialClass.schedule}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">Book Free Lesson →</span>
                </button>
              </div>
            )}

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
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="text-white/50">⭐ July: All classes $25</span>
                    <span className="text-white/30">·</span>
                    <button
                      onClick={() => document.getElementById('class-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 decoration-dotted hover:decoration-solid transition cursor-pointer"
                      style={{ color: '#F0C850' }}
                    >
                      🎁 August: Buy 3 Get 1 Free →
                    </button>
                  </div>
                  <p className="text-white/40 text-xs mt-1">📍 6787 W Tropicana Ave Suite 260 · Mon – Thu</p>
                </div>

                <div id="class-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <div className="rounded-2xl p-6 mb-6" style={{ background: selectedClass.isPrivateTrial ? 'linear-gradient(135deg, #1a2a3a, #0D0118)' : selectedClass.isJuneOnly ? 'linear-gradient(135deg, #1a3a1a, #0D0118)' : 'rgba(45,27,78,0.6)', border: selectedClass.isPrivateTrial ? '1px solid rgba(96,165,250,0.25)' : selectedClass.isJuneOnly ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(240,200,80,0.15)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedClass.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedClass.name}</h2>
                  <p style={{ color: selectedClass.isPrivateTrial ? '#60a5fa' : selectedClass.isJuneOnly ? '#4ade80' : '#F0C850' }}>{selectedClass.ageRange}</p>
                </div>
                {(selectedClass.isJuneOnly || selectedClass.isPrivateTrial) && (
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${selectedClass.isPrivateTrial ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>FREE</span>
                )}
              </div>
              <div className="text-white/50 text-sm mt-3 flex flex-wrap gap-4">
                <span>📅 {selectedClass.days}</span>
                <span>📍 6787 W Tropicana Ave, Suite 260</span>
              </div>
            </div>

            {/* ─── Discovery Camp: Week + Time Slot ─── */}
            {selectedClass.isJuneOnly && (
              <>
                <h3 className="text-lg font-bold mb-4 text-green-400">📅 Pick Your Week</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {DISCOVERY_WEEKS.map(w => {
                    const spots = campSpots.find(s => s.week === w.dates)
                    const totalLeft = spots ? spots.totalSpotsLeft : null
                    const isFull = totalLeft !== null && totalLeft <= 0
                    const isLow = totalLeft !== null && totalLeft > 0 && totalLeft <= 8
                    return (
                    <button key={w.value} onClick={() => !isFull && setDiscoveryWeek(w.value)}
                      disabled={isFull}
                      className={`p-5 rounded-2xl text-left transition-all ${isFull ? 'opacity-50 cursor-not-allowed' : ''} ${discoveryWeek === w.value ? 'ring-2 ring-green-400 scale-[1.02] shadow-lg' : isFull ? '' : 'hover:border-green-500/30 hover:scale-[1.01]'}`}
                      style={discoveryWeek === w.value
                        ? { background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,197,94,0.08))', border: '2px solid rgba(74,222,128,0.5)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-white text-lg">{w.label}</p>
                        {discoveryWeek === w.value && <span className="text-green-400 text-lg">✓</span>}
                      </div>
                      <p className="text-base text-white/70 font-medium">{w.dates}</p>
                      <p className="text-sm text-white/40 mt-1">Mon – Thu · 🍕 Pizza Thursday!</p>
                      {spots && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={isFull ? 'text-red-400 font-bold' : isLow ? 'text-amber-400 font-semibold' : 'text-green-400'}>
                              {isFull ? '❌ FULL' : isLow ? `🔥 Only ${totalLeft} spots left!` : `✅ ${totalLeft} spots available`}
                            </span>
                            <span className="text-white/30">{spots.totalEnrolled}/30</span>
                          </div>
                          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full transition-all" style={{
                              width: `${Math.min(100, (spots.totalEnrolled / 30) * 100)}%`,
                              background: isFull ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e'
                            }} />
                          </div>
                        </div>
                      )}
                    </button>
                    )
                  })}
                </div>

                <h3 className="text-lg font-bold mb-4 text-green-400">🕐 Pick Your Time</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {DISCOVERY_TIME_SLOTS.map(t => {
                    const selectedWeekData = discoveryWeek ? campSpots.find(s => DISCOVERY_WEEKS.find(w => w.value === discoveryWeek)?.dates === s.week) : null
                    const slotKey = t.value.includes('10:00') ? 'morning' : 'midday'
                    const slotInfo = selectedWeekData ? selectedWeekData[slotKey] : null
                    const slotFull = slotInfo ? slotInfo.spotsLeft <= 0 : false
                    const slotLow = slotInfo ? slotInfo.spotsLeft > 0 && slotInfo.spotsLeft <= 4 : false
                    return (
                    <button key={t.value} onClick={() => !slotFull && setDiscoveryTimeSlot(t.value)}
                      disabled={slotFull}
                      className={`p-5 rounded-2xl text-left transition-all ${slotFull ? 'opacity-50 cursor-not-allowed' : ''} ${discoveryTimeSlot === t.value ? 'ring-2 ring-green-400 scale-[1.02] shadow-lg' : slotFull ? '' : 'hover:border-green-500/30 hover:scale-[1.01]'}`}
                      style={discoveryTimeSlot === t.value
                        ? { background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,197,94,0.08))', border: '2px solid rgba(74,222,128,0.5)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-lg">{t.icon} {t.label}</p>
                        {discoveryTimeSlot === t.value && <span className="text-green-400 text-lg">✓</span>}
                      </div>
                      {slotInfo && (
                        <p className={`text-xs mt-2 font-medium ${slotFull ? 'text-red-400' : slotLow ? 'text-amber-400' : 'text-green-400/70'}`}>
                          {slotFull ? '❌ Full' : slotLow ? `🔥 ${slotInfo.spotsLeft} of 15 spots left` : `${slotInfo.spotsLeft} of 15 spots left`}
                        </p>
                      )}
                    </button>
                    )
                  })}
                </div>

                {/* Summary */}
                {discoveryWeek && discoveryTimeSlot && (
                  <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Your selection:</span>
                      <span className="text-green-400 font-semibold">{discoveryWeek} · {discoveryTimeSlot}</span>
                    </div>
                  </div>
                )}

                <button onClick={goToForm}
                  disabled={!discoveryWeek || !discoveryTimeSlot}
                  className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg, #4ade80, #22c55e)', color: '#0D0118' }}>
                  {!discoveryWeek || !discoveryTimeSlot ? 'Select a week & time slot to continue' : 'Continue to Your Info →'}
                </button>
              </>
            )}

            {/* ─── Private Trial: Instrument Picker ─── */}
            {selectedClass.isPrivateTrial && (
              <>
                <h3 className="text-lg font-bold mb-4 text-blue-400">🎵 What instrument do you want to try?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { value: 'Voice / Singing', icon: '🎤', label: 'Voice' },
                    { value: 'Piano', icon: '🎹', label: 'Piano' },
                    { value: 'Guitar', icon: '🎸', label: 'Guitar' },
                    { value: 'Drums', icon: '🥁', label: 'Drums' },
                    { value: 'Violin / Viola', icon: '🎻', label: 'Violin' },
                    { value: 'Not sure yet', icon: '🤔', label: 'Not Sure' },
                  ].map(inst => (
                    <button key={inst.value} onClick={() => setDiscoveryTimeSlot(inst.value)}
                      className={`p-4 rounded-xl text-center transition-all ${discoveryTimeSlot === inst.value ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                      style={discoveryTimeSlot === inst.value ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                      <span className="text-2xl block mb-1">{inst.icon}</span>
                      <p className="font-semibold text-sm">{inst.label}</p>
                      {discoveryTimeSlot === inst.value && <span className="text-blue-400 text-xs">✓ Selected</span>}
                    </button>
                  ))}
                </div>

                {/* ─── Preferred Day & Time ─── */}
                {discoveryTimeSlot && (
                  <>
                    {isJune ? (
                      /* ── JUNE: Mon–Thu, specific 20-min slots ── */
                      <>
                        <h3 className="text-lg font-bold mb-2 text-blue-400 mt-6">📅 Pick Your Day</h3>
                        <p className="text-white/50 text-sm mb-4">Free 20-minute private lessons · Monday – Thursday</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {JUNE_PRIVATE_DAYS.map(day => (
                            <button key={day} onClick={() => { setPreferredDay(day); setPreferredTime('') }}
                              className={`p-3 rounded-xl text-center transition-all ${preferredDay === day ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                              style={preferredDay === day ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                              <p className="font-semibold text-sm">{day}</p>
                              {preferredDay === day && <span className="text-blue-400 text-xs">✓</span>}
                            </button>
                          ))}
                        </div>

                        {preferredDay && (
                          <>
                            <h4 className="font-semibold text-sm text-white/60 mb-3">🕐 Pick Your Time Slot</h4>

                            <p className="text-xs text-blue-400/70 font-medium mb-2">☀️ Morning (8:00 – 9:40 AM)</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                              {JUNE_PRIVATE_TIMES.filter(t => t.block === 'morning').map(t => (
                                <button key={t.value} onClick={() => setPreferredTime(t.value)}
                                  className={`p-3 rounded-xl text-center transition-all ${preferredTime === t.value ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                                  style={preferredTime === t.value ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                                  <p className="font-semibold text-sm">{t.label}</p>
                                  {preferredTime === t.value && <span className="text-blue-400 text-xs">✓</span>}
                                </button>
                              ))}
                            </div>

                            <p className="text-xs text-blue-400/70 font-medium mb-2">🌤️ Afternoon (2:20 – 4:00 PM)</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                              {JUNE_PRIVATE_TIMES.filter(t => t.block === 'afternoon').map(t => (
                                <button key={t.value} onClick={() => setPreferredTime(t.value)}
                                  className={`p-3 rounded-xl text-center transition-all ${preferredTime === t.value ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                                  style={preferredTime === t.value ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                                  <p className="font-semibold text-sm">{t.label}</p>
                                  {preferredTime === t.value && <span className="text-blue-400 text-xs">✓</span>}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {preferredDay && preferredTime && (
                          <div className="p-3 rounded-xl mb-6" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                            <p className="text-sm text-white/60">Your lesson:</p>
                            <span className="text-blue-400 font-semibold">{preferredDay} at {preferredTime} · 20 minutes</span>
                          </div>
                        )}
                      </>
                    ) : (
                      /* ── AFTER JUNE: Fri–Sun, by appointment ── */
                      <>
                        <h3 className="text-lg font-bold mb-2 text-blue-400 mt-6">📅 Preferred Day & Time</h3>
                        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                          <p className="text-sm text-white/70">🗓️ Free private lessons are available <span className="text-blue-400 font-semibold">Friday – Sunday by appointment</span>. Pick the day and time that works best for you and we&apos;ll email you to confirm!</p>
                        </div>

                        <h4 className="font-semibold text-sm text-white/60 mb-3">Which day works best?</h4>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {AFTER_JUNE_DAYS.map(day => (
                            <button key={day} onClick={() => setPreferredDay(day)}
                              className={`p-4 rounded-xl text-center transition-all ${preferredDay === day ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                              style={preferredDay === day ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                              <p className="font-semibold">{day}</p>
                              {preferredDay === day && <span className="text-blue-400 text-xs">✓</span>}
                            </button>
                          ))}
                        </div>

                        <h4 className="font-semibold text-sm text-white/60 mb-3">What time works best?</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                          {[
                            { value: '9:00 AM', label: '9:00 AM' },
                            { value: '10:00 AM', label: '10:00 AM' },
                            { value: '11:00 AM', label: '11:00 AM' },
                            { value: '12:00 PM', label: '12:00 PM' },
                            { value: '1:00 PM', label: '1:00 PM' },
                            { value: '2:00 PM', label: '2:00 PM' },
                            { value: '3:00 PM', label: '3:00 PM' },
                            { value: '4:00 PM', label: '4:00 PM' },
                          ].map(t => (
                            <button key={t.value} onClick={() => setPreferredTime(t.value)}
                              className={`p-3 rounded-xl text-center transition-all ${preferredTime === t.value ? 'ring-2 ring-blue-400 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-blue-500/30'}`}
                              style={preferredTime === t.value ? { background: 'rgba(96,165,250,0.1)', border: '2px solid rgba(96,165,250,0.5)' } : {}}>
                              <p className="font-semibold text-sm">{t.label}</p>
                              {preferredTime === t.value && <span className="text-blue-400 text-xs">✓</span>}
                            </button>
                          ))}
                        </div>

                        {preferredDay && preferredTime && (
                          <div className="p-3 rounded-xl mb-6" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                            <p className="text-sm text-white/60">Your preferred time:</p>
                            <span className="text-blue-400 font-semibold">{preferredDay} at {preferredTime}</span>
                            <p className="text-xs text-white/40 mt-1">We&apos;ll email you to confirm this time!</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                <button onClick={goToForm}
                  disabled={!discoveryTimeSlot || (isJune && (!preferredDay || !preferredTime))}
                  className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', color: '#0D0118' }}>
                  {!discoveryTimeSlot
                    ? 'Pick an instrument to continue'
                    : isJune && (!preferredDay || !preferredTime)
                    ? 'Pick a day & time slot to continue'
                    : 'Continue to Your Info →'}
                </button>
              </>
            )}

            {/* ─── Paid Classes: Month/Package ─── */}
            {!selectedClass.isJuneOnly && !selectedClass.isPrivateTrial && (
            <>
            {/* Month */}
            <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>Select Month</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => { setMonth('july'); setQuantity(1); setPaidWeek('') }}
                className={`p-4 rounded-xl text-left transition ${month === 'july' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={month === 'july' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <p className="font-bold">July</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>${selectedClass.julyPrice} <span className="text-sm font-normal text-white/50">/class</span></p>
                <p className="text-xs text-white/40 mt-1">⭐ Special pricing!</p>
              </button>
              <button onClick={() => { setMonth('august'); setQuantity(1); setPaidWeek('') }}
                className={`p-4 rounded-xl text-left transition ${month === 'august' ? 'ring-2' : 'bg-white/5 border border-white/10'}`}
                style={month === 'august' ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                <p className="font-bold">August</p>
                <p className="text-lg font-bold" style={{ color: '#F0C850' }}>${selectedClass.augustSinglePrice} <span className="text-sm font-normal text-white/50">/class</span></p>
                <p className="text-xs text-white/40 mt-1">🎁 Buy 3 Get 1 Free!</p>
              </button>
            </div>

            {/* Week Selection */}
            <h3 className="font-bold mb-3" style={{ color: '#F0C850' }}>📅 Select Week</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {paidWeeks.map(w => (
                <button key={w.value} onClick={() => setPaidWeek(w.value)}
                  className={`p-4 rounded-xl text-left transition ${paidWeek === w.value ? 'ring-2 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-white/20'}`}
                  style={paidWeek === w.value ? { background: 'rgba(240,200,80,0.1)', borderColor: '#F0C850' } : {}}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-white">{w.label}</p>
                    {paidWeek === w.value && <span style={{ color: '#F0C850' }}>✓</span>}
                  </div>
                  <p className="text-sm text-white/60">{w.dates}</p>
                  <p className="text-xs text-white/30 mt-1">Mon – Thu</p>
                </button>
              ))}
            </div>

            {/* Time Slot (auto from class) */}
            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(240,200,80,0.05)', border: '1px solid rgba(240,200,80,0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🕐</span>
                <div>
                  <p className="text-sm text-white/50">Your class time</p>
                  <p className="font-bold" style={{ color: '#F0C850' }}>{selectedClass.schedule} · {selectedClass.days}</p>
                </div>
              </div>
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
              disabled={!paidWeek}
              className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(90deg, #F0C850, #FFE07A)', color: '#0D0118' }}>
              {!paidWeek ? 'Select a week to continue' : 'Continue to Enrollment →'}
            </button>
            </>
            )}
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
                {selectedClass.isPrivateTrial
                  ? (isJune
                    ? "Fill in the details below to book your free 20-minute private lesson. One per student."
                    : "Fill in the details below to request your free private lesson. We'll email you to confirm your day and time!")
                  : selectedClass.isJuneOnly
                  ? "Fill in the details below to enroll in free trial classes."
                  : "Fill in the details below, then you'll be taken to the secure payment page."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Student Name *</label>
                  <input required value={studentName} onChange={e => setStudentName(e.target.value)}
                    placeholder="Child's full name"
                    className="w-full px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Student Age *</label>
                  <input required type="number" min="1" max="99"
                    value={studentAge} onChange={e => setStudentAge(e.target.value)}
                    placeholder={selectedClass.ageRange.replace('Ages ', '')}
                    className="w-full px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/60 mb-2 font-medium">Parent / Guardian Name *</label>
                <input required value={parentName} onChange={e => setParentName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                  style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2 font-medium">Phone *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                </div>
              </div>

              {/* Enrollment Summary */}
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(45,27,78,0.6)', border: '1px solid rgba(240,200,80,0.1)' }}>
                <h4 className="font-bold mb-3" style={{ color: '#F0C850' }}>📋 Enrollment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/50">Class:</span><span>{selectedClass.emoji} {selectedClass.name}</span></div>
                  {selectedClass.isPrivateTrial && discoveryTimeSlot && (
                    <div className="flex justify-between"><span className="text-white/50">Instrument:</span><span>{discoveryTimeSlot}</span></div>
                  )}
                  {selectedClass.isPrivateTrial && (
                    <div className="flex justify-between"><span className="text-white/50">Duration:</span><span>20 minutes</span></div>
                  )}
                  {!selectedClass.isJuneOnly && !selectedClass.isPrivateTrial && (
                    <div className="flex justify-between"><span className="text-white/50">Month:</span><span>{month === 'july' ? 'July' : 'August'}</span></div>
                  )}
                  {!selectedClass.isJuneOnly && !selectedClass.isPrivateTrial && paidWeek && (
                    <div className="flex justify-between"><span className="text-white/50">Week:</span><span>{paidWeek}</span></div>
                  )}
                  {selectedClass.isJuneOnly && discoveryWeek && (
                    <div className="flex justify-between"><span className="text-white/50">Week:</span><span>{discoveryWeek}</span></div>
                  )}
                  {selectedClass.isJuneOnly && discoveryTimeSlot && (
                    <div className="flex justify-between"><span className="text-white/50">Time:</span><span>{discoveryTimeSlot}</span></div>
                  )}
                  {!selectedClass.isJuneOnly && !selectedClass.isPrivateTrial && (
                    <div className="flex justify-between"><span className="text-white/50">Schedule:</span><span>{selectedClass.days}, {selectedClass.schedule}</span></div>
                  )}
                  {selectedClass.isPrivateTrial && preferredDay && preferredTime && (
                    <div className="flex justify-between">
                      <span className="text-white/50">{isJune ? 'Lesson Time:' : 'Preferred Time:'}</span>
                      <span>{preferredDay} at {preferredTime}{!isJune ? ' (to be confirmed)' : ''}</span>
                    </div>
                  )}
                  {selectedClass.isPrivateTrial && (!preferredDay || !preferredTime) && (
                    <div className="flex justify-between"><span className="text-white/50">Schedule:</span><span>{isJune ? 'Pick a day & time above' : 'By appointment — we\'ll email to confirm!'}</span></div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/50">Price:</span>
                    <span className={`font-semibold ${(selectedClass.isJuneOnly || selectedClass.isPrivateTrial) ? 'text-green-400' : ''}`} style={(selectedClass.isJuneOnly || selectedClass.isPrivateTrial) ? {} : { color: '#F0C850' }}>
                      {getPriceLabel()}
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="text-white/50">Location:</span><span>6787 W Tropicana Ave Suite 260, Las Vegas</span></div>
                </div>
              </div>

              {/* ─── Health & Safety ─── */}
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(45,27,78,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 className="font-bold mb-4 text-white">🏥 Health & Safety Info</h4>
                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2 font-medium">Allergies (if any)</label>
                  <input value={allergies} onChange={e => setAllergies(e.target.value)}
                    placeholder="e.g. Peanuts, Latex, None"
                    className="w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2 font-medium">Emergency Contact Name *</label>
                    <input required value={emergencyName} onChange={e => setEmergencyName(e.target.value)}
                      placeholder="Contact name"
                      className="w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2 font-medium">Emergency Contact Phone *</label>
                    <input required type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ background: '#ffffff', color: '#1a1a2e', border: '2px solid rgba(240,200,80,0.2)' }} />
                  </div>
                </div>
              </div>

              {/* ─── Liability Waiver ─── */}
              <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <h4 className="font-bold mb-3 text-white">📋 Liability Waiver *</h4>
                <div className="text-sm text-white/60 mb-4 space-y-2 max-h-32 overflow-y-auto pr-2">
                  <p>I, the undersigned parent/guardian, hereby grant permission for my child to participate in BASMA — Become A Singer Music Academy activities.</p>
                  <p>I understand that music lessons and group activities carry inherent risks. I release BASMA, its instructors, and staff from any liability for injuries sustained during academy activities.</p>
                  <p>I confirm that the health and emergency contact information provided is accurate and up to date. I authorize BASMA staff to seek emergency medical treatment for my child if I cannot be reached.</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={liabilityAgreed} onChange={e => setLiabilityAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded accent-yellow-400" />
                  <span className="text-sm text-white/80 group-hover:text-white transition">
                    I have read and agree to the liability waiver. I confirm all information provided is accurate. <span className="text-red-400">*</span>
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading || !liabilityAgreed}
                className="w-full py-4 rounded-full font-bold text-lg transition hover:opacity-90 disabled:opacity-50"
                style={{ background: selectedClass.isPrivateTrial ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' : selectedClass.isJuneOnly ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #F0C850, #FFE07A)', color: '#0D0118' }}>
                {loading ? 'Processing...' : !liabilityAgreed ? '⬆ Please agree to the waiver above' : selectedClass.isPrivateTrial ? 'Book My Free Private Lesson 🎤' : selectedClass.isJuneOnly ? 'Enroll — It\'s Free! 🎶' : `Proceed to Payment · ${getPriceLabel()} →`}
              </button>
              {!selectedClass.isJuneOnly && !selectedClass.isPrivateTrial && (
                <p className="text-center text-white/30 text-xs mt-3">You&apos;ll be redirected to Stripe for secure payment</p>
              )}
              {selectedClass.isPrivateTrial && (
                <p className="text-center text-white/30 text-xs mt-3">
                  {isJune
                    ? 'One free 20-minute private lesson per student · Mon–Thu'
                    : 'One free private lesson per student · We\'ll email to confirm your appointment!'}
                </p>
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
