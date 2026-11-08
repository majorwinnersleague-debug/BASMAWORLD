'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  PACKAGES as PRICED_PACKAGES,
  STANDARD_PRICES,
  HOLIDAY_SPECIAL,
  getPrice,
  isHolidaySpecialActive,
  formatUsd,
} from '@/lib/pricing'
import { POLICY_LINES } from '@/lib/lesson-policy'
import { BOOKING_LINKS, HAS_LESSON_BOOKING } from '@/lib/booking'

/* ═══════════════════════════════════════════════════════════════════════════
   PACKAGES
   ═══════════════════════════════════════════════════════════════════════════ */

// Prices come from lib/pricing.ts (the single price list). The checkout route
// re-prices on the server, so these are for display only.
const PACKAGES = PRICED_PACKAGES.map(pkg => {
  const total = getPrice(pkg.id)
  return {
    ...pkg,
    total,
    regularTotal: STANDARD_PRICES[pkg.id],
    pricePerSession: Math.round((total / pkg.sessions) * 100) / 100,
  }
})
const SPECIAL_ACTIVE = isHolidaySpecialActive()

/* Google Ads purchase conversion: active only when both IDs are configured
   in Vercel, and only for visitors who accepted cookies. */
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
const ADS_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || ''

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }

function sendAdsConversion(sessionId: string, valueUsd: number, currency: string) {
  if (!ADS_ID || !ADS_LABEL) return
  try {
    if (localStorage.getItem('basma_cookies_accepted') !== 'true') return
    const key = `basma_ads_conv_${sessionId}`
    if (localStorage.getItem(key)) return // already counted for this purchase
    const w = window as GtagWindow
    if (!w.gtag) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ADS_ID)}`
      document.head.appendChild(s)
      w.dataLayer = w.dataLayer || []
      w.gtag = function gtag() { w.dataLayer!.push(arguments) } // eslint-disable-line prefer-rest-params
      w.gtag('js', new Date())
      w.gtag('config', ADS_ID)
    }
    w.gtag('event', 'conversion', {
      send_to: `${ADS_ID}/${ADS_LABEL}`,
      value: valueUsd,
      currency,
      transaction_id: sessionId, // Google de-duplicates on this
    })
    localStorage.setItem(key, '1')
  } catch {
    // Tracking must never break the success page.
  }
}

const INSTRUMENTS = [
  'Piano', 'Voice / Singing', 'Guitar', 'Drums', 'Ukulele', 'Recording / Production', 'Other',
]

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY PHOTOS
   ═══════════════════════════════════════════════════════════════════════════ */

const LESSON_PHOTOS = [
  { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Basma teaching a private piano lesson' },
  { src: '/images/camp/boy-keyboard.jpg', alt: 'Student concentrating during a keyboard lesson' },
  { src: '/images/camp/classroom-piano-lesson.jpg', alt: 'BASMA instructor teaching music theory' },
  { src: '/images/camp/little-girl-piano.jpg', alt: 'Young girl learning piano at BASMA' },
  { src: '/images/guitar-lesson.jpg', alt: 'Guitar instruction at BASMA' },
  { src: '/images/camp/classroom-piano-lesson.jpg', alt: 'Piano instruction in the BASMA studio' },
]

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PrivateLessonsContent() {
  const [mode, setMode] = useState<'package' | null>(null)
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null)

  // Shared form fields
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentAge, setStudentAge] = useState('')
  const [instrument, setInstrument] = useState('')
  const [preferredDay, setPreferredDay] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  // After Stripe: 'checking' → 'paid' | 'pending' | 'unknown'
  const [paymentCheck, setPaymentCheck] = useState<'none' | 'checking' | 'paid' | 'pending' | 'unknown'>('none')
  const [error, setError] = useState('')

  // Free 15-minute trial request
  const [trialOpen, setTrialOpen] = useState(false)
  const [trialStatus, setTrialStatus] = useState<'idle' | 'sending' | 'sent' | 'already' | 'error'>('idle')
  const [trialError, setTrialError] = useState('')

  const searchParams = useSearchParams()

  // After Stripe Checkout: confirm the payment with Stripe (server-side)
  // before showing "Payment Successful" or recording a conversion.
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      // Old links with only ?success=true can't be verified.
      if (searchParams.get('success') === 'true') setPaymentCheck('unknown')
      return
    }
    let cancelled = false
    setPaymentCheck('checking')
    ;(async () => {
      for (let attempt = 0; attempt < 4 && !cancelled; attempt++) {
        try {
          const res = await fetch(`/api/stripe/checkout-status?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            if (data.paid) {
              if (cancelled) return
              setPaymentCheck('paid')
              setPaymentSuccess(true)
              if (typeof data.amountTotal === 'number') {
                sendAdsConversion(sessionId, data.amountTotal / 100, data.currency || 'USD')
              }
              return
            }
          } else if (res.status === 400 || res.status === 404) {
            break
          }
        } catch {
          // network hiccup: retry
        }
        await new Promise(r => setTimeout(r, 2000))
      }
      if (!cancelled) setPaymentCheck('pending')
    })()
    return () => { cancelled = true }
  }, [searchParams])

  // Submit the free trial request
  async function handleTrialRequest(e: React.FormEvent) {
    e.preventDefault()
    setTrialStatus('sending')
    setTrialError('')
    try {
      const res = await fetch('/api/trial-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName, email, phone, studentName, studentAge,
          instrument, preferredDay, preferredTime, notes,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTrialStatus(data.alreadyRequested ? 'already' : 'sent')
      } else {
        setTrialStatus('error')
        setTrialError(data.error || 'Something went wrong. Please call us at (702) 788-7369.')
      }
    } catch {
      setTrialStatus('error')
      setTrialError('Something went wrong. Please call us at (702) 788-7369.')
    }
  }

  // Handle package purchase via Stripe
  async function handlePackagePurchase(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPkg) return
    setLoading(true)
    setError('')

    const pkg = PACKAGES.find(p => p.id === selectedPkg)
    if (!pkg) return

    try {
      const res = await fetch('/api/stripe/private-lesson-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Only the package id matters; the server sets the price.
          packageId: pkg.id,
          parentName, email, phone, studentName, studentAge,
          instrument, preferredDay, preferredTime, notes,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout. Please try again.')
      }
    } catch {
      setError('Failed to connect to payment. Please call us at (702) 788-7369.')
    } finally {
      setLoading(false)
    }
  }

  if (!paymentSuccess && paymentCheck !== 'none' && paymentCheck !== 'paid') {
    const message =
      paymentCheck === 'checking'
        ? { icon: '⏳', title: 'Confirming your payment…', body: 'This only takes a moment.' }
        : paymentCheck === 'pending'
          ? { icon: '🕐', title: 'Payment not confirmed yet', body: "We haven't received confirmation of this payment from Stripe yet. If you completed checkout, you'll get a receipt email from Stripe shortly and we'll call you to schedule. Questions? Call (702) 788-7369." }
          : { icon: '✉️', title: 'Thank you!', body: "If your payment went through, you'll get a receipt email from Stripe and we'll call you to schedule. Questions? Call (702) 788-7369." }
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ paddingTop: '64px' }}>
          <section className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
            <div className="text-5xl mb-6">{message.icon}</div>
            <h1 className="text-3xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {message.title}
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-8">{message.body}</p>
            {paymentCheck !== 'checking' && (
              <a href="/private-lessons" className="inline-block mt-4 text-sm text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">← Back to Private Lessons</a>
            )}
          </section>
        </div>
        <Footer />
      </>
    )
  }

  if (paymentSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen" style={{ paddingTop: '64px' }}>
          <section className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
            <div className="text-5xl mb-6">✅</div>
            <h1 className="text-3xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Payment Successful!
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Your private lesson package has been purchased.{' '}
              {HAS_LESSON_BOOKING ? 'Book your lesson times below.' : 'We’ll reach out to confirm your lesson schedule.'}
            </p>
            {HAS_LESSON_BOOKING && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {BOOKING_LINKS.min30 && (
                  <a href={BOOKING_LINKS.min30} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}>
                    Book a 30-minute time →
                  </a>
                )}
                {BOOKING_LINKS.min60 && (
                  <a href={BOOKING_LINKS.min60} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}>
                    Book a 1-hour time →
                  </a>
                )}
              </div>
            )}
            <div className="card-minimal rounded-xl p-5 text-left max-w-sm mx-auto">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-3">What&apos;s Next</p>
              <ul className="text-white/35 text-sm space-y-2">
                <li>✉️ Confirmation email with receipt</li>
                <li>{HAS_LESSON_BOOKING ? '📅 Book your times with the buttons above' : '📞 We’ll call to finalize your schedule'}</li>
                <li>👤 See your lessons left any time in the Parent Portal</li>
                {POLICY_LINES.slice(0, 2).map(line => <li key={line}>📋 {line}</li>)}
              </ul>
            </div>
            <a href="/private-lessons" className="inline-block mt-8 text-sm text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">← Back to Private Lessons</a>
          </section>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ paddingTop: 'calc(var(--ann-bar-height, 0px) + 64px)' }}>
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">

          {/* ── Header ── */}
          <div className="text-center mb-12">
            <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">One-on-One Instruction</p>
            <h1
              className="text-4xl md:text-5xl font-semibold text-white mb-5 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Private <span className="gradient-gold">Lessons</span>
            </h1>
            <p className="text-white/30 max-w-lg mx-auto text-sm leading-relaxed">
              Personalized music instruction tailored to your goals.
              Choose an individual lesson or a monthly package and start learning.
            </p>
          </div>

          {/* ── Quick Pay — Direct Purchase ── */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] font-bold mb-3">Ready to Start?</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Choose Your Private Lessons
              </h2>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Choose an individual lesson or monthly package below. Pay securely online, and we’ll call you to schedule your lessons.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
                {/* 30-min package */}
                <button
                  onClick={() => { window.scrollTo({ top: document.getElementById('lesson-form')?.offsetTop || 600, behavior: 'smooth' }); }}
                  className="block rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] text-center"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
                >
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">30-Minute Individual Lesson</p>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{formatUsd(getPrice('individual-30min'))}</span>
                  </div>
                  <p className="text-white/30 text-xs mb-4">One private lesson</p>
                  <span className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold transition"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}>
                    Book Now →
                  </span>
                </button>

                {/* 60-min package */}
                <button
                  onClick={() => { window.scrollTo({ top: document.getElementById('lesson-form')?.offsetTop || 600, behavior: 'smooth' }); }}
                  className="block rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] relative text-center"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
                >
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">60-Minute Individual Lesson</p>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{formatUsd(getPrice('individual-60min'))}</span>
                  </div>
                  <p className="text-white/30 text-xs mb-4">One private lesson</p>
                  <span className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold transition"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}>
                    Book Now →
                  </span>
                </button>
              </div>

              <p className="text-white/20 text-xs">Secure payment via Stripe · All major cards accepted · Lessons valid for 3 months</p>

              {SPECIAL_ACTIVE && (
                <p className="text-[#c9a84c] text-sm font-semibold mt-4">
                  🎁 {HOLIDAY_SPECIAL.label}: monthly packages {formatUsd(getPrice('monthly-4x30min'))} (4 × 30 min) and {formatUsd(getPrice('monthly-4x60min'))} (4 × 60 min), {HOLIDAY_SPECIAL.endsLabel}.
                </p>
              )}

              {/* ── Free 15-minute trial ── */}
              <div id="free-trial" className="mt-8 pt-6 text-left max-w-xl mx-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">New to BASMA?</p>
                  <p className="text-white text-lg font-semibold mb-1">Free 15-Minute Trial Lesson</p>
                  <p className="text-white/30 text-sm mb-4">One free trial per student. No payment needed. We&apos;ll call to schedule it.</p>
                  {!trialOpen && (
                    <button
                      type="button"
                      onClick={() => setTrialOpen(true)}
                      className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition hover:scale-[1.02]"
                      style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
                    >
                      Request a Free Trial →
                    </button>
                  )}
                </div>

                {trialOpen && (trialStatus === 'sent' || trialStatus === 'already') && (
                  <div className="card-minimal rounded-xl p-5 text-center mt-2">
                    <p className="text-white font-semibold mb-1">
                      {trialStatus === 'sent' ? '✅ Trial requested!' : '✅ We already have a trial request for this student.'}
                    </p>
                    {BOOKING_LINKS.trial ? (
                      <a href={BOOKING_LINKS.trial} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}>
                        Pick your free trial time →
                      </a>
                    ) : (
                      <p className="text-white/40 text-sm">We&apos;ll contact you shortly to schedule it.</p>
                    )}
                  </div>
                )}

                {trialOpen && trialStatus !== 'sent' && trialStatus !== 'already' && (
                  <form onSubmit={handleTrialRequest} className="space-y-3 mt-2">
                    <div className="grid md:grid-cols-2 gap-3">
                      <input required value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Parent / guardian name *" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone *" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Student name *" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <input value={studentAge} onChange={e => setStudentAge(e.target.value)} placeholder="Student age" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <select value={instrument} onChange={e => setInstrument(e.target.value)} className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm">
                        <option value="" className="bg-[#111]">Instrument (optional)</option>
                        {INSTRUMENTS.map(i => <option key={i} value={i} className="bg-[#111]">{i}</option>)}
                      </select>
                      <input value={preferredDay} onChange={e => setPreferredDay(e.target.value)} placeholder="Preferred day (optional)" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                      <input value={preferredTime} onChange={e => setPreferredTime(e.target.value)} placeholder="Preferred time (optional)" className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                    </div>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything we should know? (optional)" rows={2} className="w-full rounded-lg px-4 py-3 bg-white/[0.04] border border-white/10 text-white text-sm placeholder-white/30" />
                    {trialStatus === 'error' && <p className="text-red-400 text-sm">{trialError}</p>}
                    <button
                      type="submit"
                      disabled={trialStatus === 'sending'}
                      className="w-full py-3 rounded-full text-sm font-semibold transition disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#0D0118' }}
                    >
                      {trialStatus === 'sending' ? 'Sending…' : 'Request My Free Trial'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact for questions */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Have questions?</p>
                <a
                  href="tel:+17027887369"
                  className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition hover:scale-[1.02]"
                  style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
                >
                  📞 Call (702) 788-7369
                </a>
              </div>
            </div>
          </div>

          {/* ── Hero Photo ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 items-center max-w-4xl mx-auto">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <Image
                src="/images/camp/students-guitar-duo.jpg"
                alt="Guitar lesson at BASMA"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <div className="text-center md:text-left">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold mb-4"
                style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                Personalized Instruction
              </div>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Learn at <span className="gradient-gold">Your Pace</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-4">
                One-on-one lessons tailored to your goals. Pick your instrument, choose a package, and start learning with a dedicated instructor.
              </p>
              <ul className="text-white/30 text-sm space-y-2 mb-6">
                <li>✅ Any instrument — piano, guitar, voice, drums & more</li>
                <li>✅ 30-minute or 60-minute sessions</li>
                <li>✅ Flexible scheduling</li>
                <li>✅ Valid for 3 months · first missed lesson forgiven</li>
              </ul>
              <a
                href="tel:+17027887369"
                className="inline-block px-8 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
              >
                📞 Call to Schedule
              </a>
            </div>
          </div>

          {/* ── How It Works ── */}
          <div className="text-center mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { step: '1', title: 'Pick & Pay', desc: 'Choose your lesson package above and pay instantly online.', emoji: '💳' },
              { step: '2', title: 'We Schedule You', desc: 'We\'ll call you within 24 hours to finalize your lesson day, time, and instructor.', emoji: '📞' },
              { step: '3', title: 'Start Learning', desc: 'Book your times and attend your lessons. Use them within 3 months of purchase.', emoji: '🎹' },
            ].map(item => (
              <div key={item.step} className="card-minimal rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-xs text-[#c9a84c]/50 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* ── What You'll Learn ── */}
          <div className="text-center mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Instruments We Teach</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
            {[
              { emoji: '🎹', name: 'Piano', desc: 'Classical, pop, jazz' },
              { emoji: '🎸', name: 'Guitar', desc: 'Acoustic & electric' },
              { emoji: '🎤', name: 'Voice', desc: 'Singing & technique' },
              { emoji: '🥁', name: 'Drums', desc: 'Rhythm & percussion' },
              { emoji: '🎻', name: 'Violin', desc: 'Classical & fiddle' },
              { emoji: '🪕', name: 'Ukulele', desc: 'Fun & beginner-friendly' },
              { emoji: '🎙️', name: 'Recording', desc: 'Production & mixing' },
              { emoji: '📝', name: 'Music Theory', desc: 'Reading & composing' },
            ].map(inst => (
              <div key={inst.name} className="card-minimal rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{inst.emoji}</div>
                <h3 className="text-white text-sm font-medium">{inst.name}</h3>
                <p className="text-white/25 text-xs">{inst.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Photo Gallery ── */}
          <div className="text-center mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Inside Our Lessons</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16 max-w-4xl mx-auto">
            {LESSON_PHOTOS.map((photo, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: i === 0 || i === 5 ? '16/10' : '4/3' }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
            ))}
          </div>

          {/* ── Meet the Team ── */}
          <div className="text-center mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Your Instructor</h2>
            <p className="text-white/25 text-sm max-w-lg mx-auto">
              Our team of passionate musicians and educators brings real-world performance experience
              into every lesson. Whether your child is picking up an instrument for the first time or
              preparing for a recital, they&apos;re in expert hands.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {/* Instructor 1 - Basma (founder) */}
            <div className="card-minimal rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/images/basma-headshot.jpg"
                  alt="Basma — Founder & Lead Instructor at BASMA Music Academy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-base mb-1">Basma</h3>
                <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">Founder &amp; Lead Instructor</p>
                <p className="text-white/30 text-xs leading-relaxed mb-3">
                  Singer, songwriter, and music educator with years of performance and teaching experience.
                  Basma founded the academy to make music education accessible and joyful for every child in Las Vegas.
                </p>
                <p className="text-white/20 text-xs">🎹 Piano · 🎸 Guitar · 🎤 Voice · 🎸 Bass</p>
              </div>
            </div>

            {/* Instructor 2 -  */}
            <div className="card-minimal rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/images/camp/classroom-piano-lesson.jpg"
                  alt=" at BASMA Music Academy"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-base mb-1"></h3>
                <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">Music Instructor</p>
                <p className="text-white/30 text-xs leading-relaxed mb-3">
                  A versatile multi-instrumentalist with a passion for classical and contemporary music.
                   brings warmth, patience, and expertise to every lesson — from beginners to advanced students.
                </p>
                <p className="text-white/20 text-xs">🎹 Piano · 🎻 Violin · 🎻 Viola · 🎻 Cello</p>
              </div>
            </div>

            {/* Why BASMA */}
            <div className="card-minimal rounded-xl overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/images/camp/students-guitar-duo.jpg"
                  alt="Students learning guitar at BASMA Music Academy"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-base mb-1">Why BASMA?</h3>
                <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-3">What Sets Us Apart</p>
                <p className="text-white/30 text-xs leading-relaxed">
                  , real instruments from day one, performance opportunities,
                  and a warm community that feels like family. We believe every child has a song inside them.
                </p>
              </div>
            </div>
          </div>

          {/* ── Pricing Cards ── */}
          <div id="lesson-form" className="text-center mb-8">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Purchase with Details</h2>
            <p className="text-white/20 text-xs mt-2">Want to specify your instrument and schedule preferences? Use the form below.</p>
            <p className="text-white/15 text-xs mt-1">For instant checkout, use the <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-[#c9a84c]/50 hover:text-[#c9a84c] underline">Pay Now buttons above ↑</a></p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
            {/* Package Cards */}
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => { setMode('package'); setSelectedPkg(pkg.id) }}
                className={`card-minimal rounded-xl p-6 cursor-pointer transition-all duration-200 border-2 relative ${
                  mode === 'package' && selectedPkg === pkg.id
                    ? 'border-[#c9a84c]/50 bg-[#c9a84c]/5'
                    : 'border-transparent hover:border-white/10'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-4 bg-[#c9a84c] text-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                    {pkg.sessions} Lessons
                  </span>
                  <span className="text-2xl">🎹</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{pkg.name}</h3>
                <p className="text-white/30 text-sm mb-4">{pkg.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{formatUsd(pkg.pricePerSession)}</span>
                  <span className="text-white/30 text-sm">/ session</span>
                </div>
                <p className="text-white/20 text-xs mt-1">
                  {pkg.total < pkg.regularTotal && (
                    <span className="line-through mr-1">{formatUsd(pkg.regularTotal)}</span>
                  )}
                  {formatUsd(pkg.total)} total for {pkg.sessions} × {pkg.duration} sessions
                </p>
                {pkg.total < pkg.regularTotal && (
                  <p className="text-[#c9a84c] text-xs mt-1 font-semibold">🎁 {HOLIDAY_SPECIAL.label} {HOLIDAY_SPECIAL.endsLabel}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Lesson Policy (lib/lesson-policy.ts) ── */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="card-minimal rounded-xl p-5 border border-white/[0.06]">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">📋 Lesson Policy</p>
              <ul className="text-white/30 text-sm leading-relaxed list-disc ml-5 space-y-1">
                {POLICY_LINES.map(line => <li key={line}>{line}</li>)}
              </ul>
              {HAS_LESSON_BOOKING && (
                <p className="text-white/40 text-sm mt-3">
                  Already have lessons?{' '}
                  {BOOKING_LINKS.min30 && <a href={BOOKING_LINKS.min30} target="_blank" rel="noopener noreferrer" className="underline text-[#c9a84c]">Book a 30-minute time</a>}
                  {BOOKING_LINKS.min30 && BOOKING_LINKS.min60 && ' or '}
                  {BOOKING_LINKS.min60 && <a href={BOOKING_LINKS.min60} target="_blank" rel="noopener noreferrer" className="underline text-[#c9a84c]">book a 1-hour time</a>}.
                </p>
              )}
            </div>
          </div>

          {/* ── Form ── */}
          {mode && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {'Purchase Lesson Package'}
                </h2>
                <p className="text-white/30 text-sm mt-2">
                  {`${PACKAGES.find(p => p.id === selectedPkg)?.name} — $${PACKAGES.find(p => p.id === selectedPkg)?.total} total`}
                </p>
              </div>

              <form onSubmit={handlePackagePurchase} className="space-y-4">
                {/* Parent / Contact */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Parent / Guardian Name *</label>
                    <input type="text" required value={parentName} onChange={e => setParentName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Email *</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition" placeholder="you@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Phone *</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition" placeholder="(702) 555-1234" />
                </div>

                {/* Student Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Student Name *</label>
                    <input type="text" required value={studentName} onChange={e => setStudentName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition" placeholder="Student's first & last name" />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Student Age</label>
                    <input type="text" value={studentAge} onChange={e => setStudentAge(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition" placeholder="e.g. 8" />
                  </div>
                </div>

                {/* Instrument */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Instrument / Focus</label>
                  <select value={instrument} onChange={e => setInstrument(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 transition appearance-none">
                    <option value="" className="bg-[#111]">Select an instrument...</option>
                    {INSTRUMENTS.map(i => (<option key={i} value={i} className="bg-[#111]">{i}</option>))}
                  </select>
                </div>

                {/* Scheduling */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Preferred Day</label>
                    <select value={preferredDay} onChange={e => setPreferredDay(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 transition appearance-none">
                      <option value="" className="bg-[#111]">Flexible</option>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                        <option key={d} value={d} className="bg-[#111]">{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Preferred Time</label>
                    <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 transition appearance-none">
                      <option value="" className="bg-[#111]">Flexible</option>
                      {['Morning (9–12)', 'Afternoon (12–3)', 'Late Afternoon (3–5)', 'Evening (5–7)'].map(t => (
                        <option key={t} value={t} className="bg-[#111]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-widest mb-2">Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition resize-none"
                    placeholder="Any special requests, experience level, or goals..." />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
                )}

                <button type="submit" disabled={loading}
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    false
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                      : 'bg-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/30 border border-[#c9a84c]/30'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? 'Processing...' : `Pay $${PACKAGES.find(p => p.id === selectedPkg)?.total} — Proceed to Checkout`}
                </button>

                {mode === 'package' && (
                  <p className="text-white/20 text-xs text-center">Secure payment via Stripe · You&apos;ll be redirected to complete your purchase</p>
                )}
              </form>
            </div>
          )}

          {/* ── Testimonial / Parent Assurance ── */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="card-minimal rounded-xl p-8 text-center" style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[#c9a84c] text-xl mb-4">&quot;🎵&quot;</p>
              <p className="text-white/50 text-sm leading-relaxed italic max-w-md mx-auto mb-4">
                Every child deserves the chance to discover their musical gift.
                At BASMA, we don&apos;t just teach music — we build confidence, creativity, and lifelong skills.
              </p>
              <p className="text-white/30 text-xs">— Basma, Founder &amp; Lead Instructor</p>
            </div>
          </div>

          {/* ── Location / Contact ── */}
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <p className="text-white/20 text-xs uppercase tracking-widest mb-4">Questions?</p>
            <p className="text-white/40 text-sm">📍 9512 W Flamingo Rd, Ste 100, Las Vegas, NV 89147</p>
            <p className="text-white/40 text-sm mt-1">
              📞 <a href="tel:+17027887369" className="text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">(702) 788-7369</a>
              {' · '}
              <a href="https://wa.me/17027887369" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">WhatsApp</a>
            </p>
          </div>

        </section>
      </div>
      <Footer />
    </>
  )
}
