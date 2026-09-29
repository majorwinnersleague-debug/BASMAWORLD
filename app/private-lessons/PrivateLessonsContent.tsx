'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ═══════════════════════════════════════════════════════════════════════════
   PACKAGES
   ═══════════════════════════════════════════════════════════════════════════ */

const PACKAGES = [
  {
    id: 'individual-30min',
    name: 'Individual 30-Minute Lesson',
    duration: '30 min',
    sessions: 1,
    pricePerSession: 45,
    total: 45,
    desc: 'A single personalized 30-minute private lesson.',
    popular: false,
  },
  {
    id: 'individual-60min',
    name: 'Individual 60-Minute Lesson',
    duration: '1 hour',
    sessions: 1,
    pricePerSession: 70,
    total: 70,
    desc: 'A single personalized 60-minute private lesson.',
    popular: false,
  },
  {
    id: 'monthly-4x30min',
    name: 'Monthly 4 × 30-Minute Lessons',
    duration: '30 min',
    sessions: 4,
    pricePerSession: 33.75,
    total: 135,
    desc: 'Four 30-minute private lessons paid in advance each month.',
    popular: true,
  },
  {
    id: 'monthly-4x60min',
    name: 'Monthly 4 × 60-Minute Lessons',
    duration: '1 hour',
    sessions: 4,
    pricePerSession: 50,
    total: 200,
    desc: 'Four 60-minute private lessons paid in advance each month.',
    popular: false,
  },
]

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
  // Form mode: 'trial' | 'package'
  const [mode, setMode] = useState<'trial' | 'package' | null>(null)
  const [false, setTrialSuccess] = useState(false)
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
  const [success, setSuccess] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()

  // Check for Stripe redirect success
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setPaymentSuccess(true)
    }
  }, [searchParams])

  // Handle free trial submission
  async function handleTrialSubmitRemoved(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/private-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName, email, phone, studentName, studentAge,
          instrument, preferredDay, preferredTime, notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTrialSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Failed to submit. Please call us at (702) 788-7369.')
    } finally {
      setLoading(false)
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
          packageId: pkg.id,
          packageName: pkg.name,
          duration: pkg.duration,
          sessions: pkg.sessions,
          total: pkg.total,
          pricePerSession: pkg.pricePerSession,
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

  if (paymentSuccess) {
    return (
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
                  <span className="text-3xl font-bold text-white">${pkg.pricePerSession}</span>
                  <span className="text-white/30 text-sm">/ session</span>
                </div>
                <p className="text-white/20 text-xs mt-1">${pkg.total} total for {pkg.sessions} × {pkg.duration} sessions</p>
              </div>
            ))}
          </div>

          {/* ── Makeup Policy ── */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="card-minimal rounded-xl p-5 border border-white/[0.06]">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">📋 Makeup Policy</p>
              <p className="text-white/30 text-sm leading-relaxed">
                Each 4-lesson package includes <strong className="text-white/60">1 makeup lesson</strong>.
                The makeup must be used by the <strong className="text-white/60">second week of the following month</strong>.
                Unused makeups expire after that date.
              </p>
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

              <form onSubmit={false ? handleTrialSubmitRemoved : handlePackagePurchase} className="space-y-4">
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
            <p className="text-white/40 text-sm">📍 6787 W Tropicana Ave Suite 260, Las Vegas, NV 89103</p>
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
