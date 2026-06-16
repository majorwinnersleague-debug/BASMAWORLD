'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════
   CLASS DATA (same as /enroll but used for matching)
   ═══════════════════════════════════════════════════════════════ */

interface ClassRec {
  id: string
  name: string
  emoji: string
  ageRange: string
  minAge: number
  maxAge: number
  schedule: string
  days: string
  price: string
  description: string
  tags: string[] // for interest matching
  isFree: boolean
  isPrivate: boolean
  enrollLink: string
  matchReason?: string
}

const isJune = new Date().getMonth() === 5

const ALL_CLASSES: ClassRec[] = [
  {
    id: 'free-private-lesson', name: 'Free Private Lesson', emoji: '🎤',
    ageRange: 'All Ages', minAge: 2, maxAge: 99,
    schedule: isJune ? '8:00–9:40 AM & 2:20–4:00 PM' : 'By Appointment (Fri–Sun)',
    days: isJune ? 'Mon – Thu' : 'Fri – Sun',
    price: 'FREE', description: 'One free 20-minute private lesson — voice, piano, guitar, or drums.',
    tags: ['voice', 'piano', 'guitar', 'drums', 'singing', 'performance', 'instrument'],
    isFree: true, isPrivate: true,
    enrollLink: '/enroll?class=free-private',
  },
  {
    id: 'discovery-camp-11-17', name: 'Discovery Camp', emoji: '🌟',
    ageRange: 'Ages 11–17', minAge: 11, maxAge: 17,
    schedule: '10:00 AM – 12:00 PM', days: 'Mon – Thu (June)',
    price: 'FREE', description: 'Piano, voice, performance & dance — an exciting introduction to music. Free trial!',
    tags: ['voice', 'piano', 'dance', 'performance', 'singing'],
    isFree: true, isPrivate: false,
    enrollLink: '/enroll?class=discovery-11-17',
  },
  {
    id: 'discovery-camp-5-10', name: 'Discovery Camp', emoji: '🌟',
    ageRange: 'Ages 5–10', minAge: 5, maxAge: 10,
    schedule: '12:00 – 2:00 PM', days: 'Mon – Thu (June)',
    price: 'FREE', description: 'Piano, voice, performance & dance — a fun, engaging introduction to music. Free trial!',
    tags: ['voice', 'piano', 'dance', 'performance', 'singing'],
    isFree: true, isPrivate: false,
    enrollLink: '/enroll?class=discovery-5-10',
  },
  {
    id: 'tiny-tots', name: 'Tiny Tots Music & Fun', emoji: '👶',
    ageRange: 'Ages 2–5', minAge: 2, maxAge: 5,
    schedule: '9:00 – 9:45 AM', days: 'Mon – Thu',
    price: 'From $25/class', description: 'A fun, playful introduction to music for our youngest learners!',
    tags: ['singing', 'dance', 'performance', 'voice', 'piano'],
    isFree: false, isPrivate: false,
    enrollLink: '/enroll?class=tiny-tots&month=july',
  },
  {
    id: 'kids-music-5-10', name: 'Kids Music & Fun', emoji: '🎵',
    ageRange: 'Ages 5–10', minAge: 5, maxAge: 10,
    schedule: '10:00 – 11:30 AM', days: 'Mon – Thu',
    price: 'From $25/class', description: 'Piano, voice, performance & dance for younger kids.',
    tags: ['voice', 'piano', 'dance', 'performance', 'singing'],
    isFree: false, isPrivate: false,
    enrollLink: '/enroll?class=kids-5-10&month=july',
  },
  {
    id: 'kids-music-11-17', name: 'Kids Music & Fun', emoji: '🎵',
    ageRange: 'Ages 11–17', minAge: 11, maxAge: 17,
    schedule: '11:30 AM – 1:00 PM', days: 'Mon – Thu',
    price: 'From $25/class', description: 'Piano, voice, performance & dance for older kids and teens.',
    tags: ['voice', 'piano', 'dance', 'performance', 'singing'],
    isFree: false, isPrivate: false,
    enrollLink: '/enroll?class=kids-music&month=july',
  },
  {
    id: 'piano', name: 'Piano Class', emoji: '🎹',
    ageRange: 'All Ages', minAge: 2, maxAge: 99,
    schedule: '1:30 – 2:45 PM', days: 'Mon – Thu',
    price: 'From $25/class', description: 'Focused piano instruction for all skill levels.',
    tags: ['piano', 'instrument', 'keyboard'],
    isFree: false, isPrivate: false,
    enrollLink: '/enroll?class=piano&month=july',
  },
  {
    id: 'teens-recording', name: 'Teens Recording Studio', emoji: '🎙️',
    ageRange: 'Ages 13–17', minAge: 13, maxAge: 17,
    schedule: '3:00 – 4:15 PM', days: 'Mon – Thu',
    price: 'From $25/class', description: 'Learn recording, production, and performance in a real studio!',
    tags: ['recording', 'production', 'instrument', 'voice', 'performance'],
    isFree: false, isPrivate: false,
    enrollLink: '/enroll?class=teens-recording&month=july',
  },
]

const INTEREST_OPTIONS = [
  { value: 'singing', label: '🎤 Singing / Voice', icon: '🎤' },
  { value: 'piano', label: '🎹 Piano / Keyboard', icon: '🎹' },
  { value: 'dance', label: '💃 Dance / Performance', icon: '💃' },
  { value: 'guitar', label: '🎸 Guitar', icon: '🎸' },
  { value: 'drums', label: '🥁 Drums', icon: '🥁' },
  { value: 'recording', label: '🎙️ Recording / Production', icon: '🎙️' },
  { value: 'everything', label: '✨ All of the above!', icon: '✨' },
]

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function StartPage() {
  const [step, setStep] = useState<'intro' | 'results'>('intro')

  // Form state
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function toggleInterest(val: string) {
    if (val === 'everything') {
      if (interests.includes('everything')) {
        setInterests([])
      } else {
        setInterests(INTEREST_OPTIONS.map(i => i.value))
      }
      return
    }
    setInterests(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== 'everything'), val]
    )
  }

  // Match classes based on age + interests
  const recommendations = useMemo(() => {
    const age = parseInt(childAge) || 0
    if (!age) return []

    const interestSet = new Set(interests.includes('everything')
      ? INTEREST_OPTIONS.filter(i => i.value !== 'everything').map(i => i.value)
      : interests
    )

    const scored: (ClassRec & { score: number; reasons: string[] })[] = []

    for (const c of ALL_CLASSES) {
      // Must match age
      if (age < c.minAge || age > c.maxAge) continue
      // Skip June-only discovery if not June
      if (c.id.startsWith('discovery-camp') && !isJune) continue

      let score = 0
      const reasons: string[] = []

      // Age match
      if (c.ageRange !== 'All Ages') {
        score += 3 // specific age range match is strong
        reasons.push(`Perfect for age ${age}`)
      } else {
        score += 1
        reasons.push('Open to all ages')
      }

      // Interest match
      const tagMatches = c.tags.filter(t => interestSet.has(t))
      if (tagMatches.length > 0) {
        score += tagMatches.length * 2
        reasons.push(`Matches your interests`)
      }

      // Bonus for free classes
      if (c.isFree) {
        score += 2
        reasons.push('Free — great way to start!')
      }

      scored.push({ ...c, score, reasons, matchReason: reasons[0] })
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score)
    return scored
  }, [childAge, interests])

  const topPick = recommendations[0] || null
  const otherRecs = recommendations.slice(1)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!childName.trim() || !childAge || !parentName.trim() || !email.trim()) return
    setSaving(true)

    // Save lead to Airtable in background
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parentName,
          email,
          phone,
          studentName: childName,
          studentAge: childAge,
          source: 'smart-signup-funnel',
          status: 'New Lead',
          interests: interests.filter(i => i !== 'everything').join(', '),
        }),
      })
    } catch { /* best-effort */ }

    setSaving(false)
    setStep('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ─── INTRO / FORM STEP ─────────────────────────────────── */
  if (step === 'intro') {
    return (
      <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #1a0d30 0%, #0D0118 40%, #2D1B4E 100%)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F0C850 0%, transparent 70%)' }} />

          {/* Nav */}
          <nav className="flex justify-between items-center px-6 py-5 max-w-5xl mx-auto relative z-10">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
              B.A.S.M.A.
            </Link>
            <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition">← Home</Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center px-6 pt-8 pb-16 max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(240,200,80,0.1)', color: '#F0C850', border: '1px solid rgba(240,200,80,0.2)' }}>
              🎵 Summer 2026 · Las Vegas
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span style={{ color: '#F0C850' }}>Find the Perfect</span>
              <br />
              <span className="text-white">Music Class</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-2">
              Tell us about your child and we&apos;ll recommend the best classes just for them.
            </p>
            <p className="text-sm text-white/30">
              📍 6787 W Tropicana Ave Suite 260 · Mon – Thu
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-lg mx-auto px-6 -mt-4 pb-20 relative z-20">
          <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-6" style={{ background: 'linear-gradient(135deg, rgba(45,27,78,0.8), rgba(13,1,24,0.95))', border: '1px solid rgba(240,200,80,0.15)', backdropFilter: 'blur(12px)' }}>

            <h2 className="text-xl font-bold text-center" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
              About Your Child
            </h2>

            {/* Student Name */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Child&apos;s Name *</label>
              <input
                type="text" required value={childName} onChange={e => setChildName(e.target.value)}
                placeholder="First and Last Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F0C850]/50 transition"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Child&apos;s Age *</label>
              <select
                required value={childAge} onChange={e => setChildAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#F0C850]/50 transition appearance-none"
              >
                <option value="" className="bg-[#1a0d30]">Select age...</option>
                {Array.from({ length: 17 }, (_, i) => i + 2).map(a => (
                  <option key={a} value={a} className="bg-[#1a0d30]">{a} years old</option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm text-white/60 mb-2">What are they interested in?</label>
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => toggleInterest(opt.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left transition flex items-center gap-2 ${
                      interests.includes(opt.value)
                        ? 'ring-2 font-semibold'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                    style={interests.includes(opt.value) ? { background: 'rgba(240,200,80,0.12)', borderColor: '#F0C850', color: '#F0C850' } : { color: 'rgba(255,255,255,0.7)' }}
                  >
                    <span>{opt.icon}</span> {opt.value === 'everything' ? 'All of the above!' : opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(240,200,80,0.1)' }} />

            <h2 className="text-xl font-bold text-center" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
              Parent / Guardian
            </h2>

            {/* Parent Name */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Your Name *</label>
              <input
                type="text" required value={parentName} onChange={e => setParentName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F0C850]/50 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Email *</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F0C850]/50 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Phone</label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F0C850]/50 transition"
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving || !childName.trim() || !childAge || !parentName.trim() || !email.trim()}
              className="w-full py-4 rounded-xl font-bold text-lg transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #F0C850, #c9a84c)', color: '#0D0118' }}
            >
              {saving ? 'Finding classes...' : 'See My Recommended Classes →'}
            </button>

            <p className="text-xs text-white/30 text-center">
              We&apos;ll only use your info to help with enrollment. No spam, ever.
            </p>
          </form>
        </div>

        {/* Social proof */}
        <div className="text-center pb-16 px-6">
          <div className="flex flex-wrap justify-center gap-8 text-white/30 text-sm">
            <span>🎵 200+ students enrolled</span>
            <span>⭐ 4.9 parent rating</span>
            <span>📍 Las Vegas, NV</span>
          </div>
        </div>
      </main>
    )
  }

  /* ─── RESULTS STEP ──────────────────────────────────────── */
  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#F0C850', fontFamily: "'Playfair Display', serif" }}>
          B.A.S.M.A.
        </Link>
        <button onClick={() => { setStep('intro'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-sm text-white/50 hover:text-white/80 transition">
          ← Start over
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Personalized header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
            ✨ Personalized for {childName.split(' ')[0]}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {recommendations.length > 0 ? (
              <>
                <span style={{ color: '#F0C850' }}>We found {recommendations.length} </span>
                <span className="text-white">{recommendations.length === 1 ? 'class' : 'classes'} for {childName.split(' ')[0]}!</span>
              </>
            ) : (
              <span className="text-white">Let&apos;s find the right fit!</span>
            )}
          </h1>
          <p className="text-white/50">
            {parseInt(childAge) > 0 && `Age ${childAge}`}
            {interests.length > 0 && ` · Interested in ${interests.filter(i => i !== 'everything').slice(0, 3).join(', ')}`}
            {interests.length > 3 && ' & more'}
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(45,27,78,0.4)', border: '1px solid rgba(240,200,80,0.1)' }}>
            <p className="text-4xl mb-4">🎵</p>
            <p className="text-xl font-bold mb-2">No exact match right now</p>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              But we&apos;d love to hear from you! Our classes cover ages 2–17 with programs in voice, piano, dance, guitar, drums & recording.
            </p>
            <a href="mailto:becomeasingermusicacademy@gmail.com" className="inline-block px-6 py-3 rounded-xl font-bold" style={{ background: 'linear-gradient(135deg, #F0C850, #c9a84c)', color: '#0D0118' }}>
              Contact Us →
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Pick */}
            {topPick && (
              <div className="relative">
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold z-10" style={{ background: '#F0C850', color: '#0D0118' }}>
                  ⭐ TOP PICK
                </div>
                <Link href={`${topPick.enrollLink}&studentName=${encodeURIComponent(childName)}&studentAge=${childAge}&parentName=${encodeURIComponent(parentName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`}
                  className="block rounded-2xl p-6 transition hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, rgba(240,200,80,0.12), rgba(45,27,78,0.6))', border: '2px solid rgba(240,200,80,0.3)' }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{topPick.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{topPick.name}</h3>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={topPick.isFree ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e' } : { background: 'rgba(240,200,80,0.1)', color: '#F0C850' }}>
                          {topPick.price}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-0.5">{topPick.ageRange} · {topPick.schedule}</p>
                      <p className="text-white/70 mt-2">{topPick.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                          {topPick.matchReason}
                        </span>
                        <span className="text-xs text-white/30">📅 {topPick.days}</span>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-2 font-semibold text-sm" style={{ color: '#F0C850' }}>
                        Enroll Now → 
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Recommendations */}
            {otherRecs.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-white/80 mt-8 mb-2">Also great for {childName.split(' ')[0]}:</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {otherRecs.map(c => (
                    <Link key={c.id}
                      href={`${c.enrollLink}&studentName=${encodeURIComponent(childName)}&studentAge=${childAge}&parentName=${encodeURIComponent(parentName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`}
                      className="block rounded-2xl p-5 transition hover:scale-[1.02]"
                      style={{ background: 'rgba(45,27,78,0.5)', border: '1px solid rgba(240,200,80,0.1)' }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-white truncate">{c.name}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={c.isFree ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e' } : { background: 'rgba(240,200,80,0.1)', color: '#F0C850' }}>
                              {c.price}
                            </span>
                          </div>
                          <p className="text-xs text-white/40">{c.ageRange} · {c.schedule}</p>
                          <p className="text-sm text-white/60 mt-1 line-clamp-2">{c.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
                              {c.matchReason}
                            </span>
                            <span className="text-xs font-semibold" style={{ color: '#F0C850' }}>View →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Bundle Promo */}
            <div className="rounded-2xl p-6 mt-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(240,200,80,0.08), rgba(45,27,78,0.4))', border: '1px solid rgba(240,200,80,0.15)' }}>
              <p className="text-2xl mb-2">🎁</p>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#F0C850' }}>Summer Special: Buy 3 Get 1 Free</h3>
              <p className="text-sm text-white/50 mb-4">August classes — enroll for 3 weeks, get the 4th week free!</p>
              <Link href={`/enroll?studentName=${encodeURIComponent(childName)}&studentAge=${childAge}&parentName=${encodeURIComponent(parentName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`}
                className="inline-block px-6 py-2.5 rounded-xl font-bold text-sm transition hover:scale-105"
                style={{ background: 'rgba(240,200,80,0.15)', color: '#F0C850', border: '1px solid rgba(240,200,80,0.3)' }}
              >
                Browse All Classes →
              </Link>
            </div>

            {/* Weekly Pass */}
            <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h3 className="font-bold mb-1 text-purple-300">💰 Want it all? Weekly Pass — $350/month</h3>
              <p className="text-sm text-white/40">Unlimited access to all classes, Mon–Thu. Best value for serious learners.</p>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-16 text-center text-white/30 text-sm space-y-2">
          <p>📍 6787 W Tropicana Ave Suite 260, Las Vegas, NV</p>
          <p>Questions? Email <a href="mailto:becomeasingermusicacademy@gmail.com" className="underline hover:text-white/50 transition">becomeasingermusicacademy@gmail.com</a></p>
          <p className="text-xs text-white/20 mt-4">© 2026 Become A Singer Music Academy</p>
        </div>
      </div>
    </main>
  )
}
