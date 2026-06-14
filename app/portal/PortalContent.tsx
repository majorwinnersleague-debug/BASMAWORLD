'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Registration {
  _id: string
  _creationTime: number
  studentName: string
  age: number
  classType: string
  parentName: string
  parentEmail: string
  parentPhone: string
  paymentStatus: string
  photoConsent: boolean
  allergies: string
  medications: string
  medicalConditions: string
  emergencyContactName: string
  emergencyContactPhone: string
  liabilityAgreed: boolean
  createdAt?: number
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }
  return phone
}

function getClassEmoji(classType: string): string {
  if (classType.includes('Tiny Tots')) return '🧸'
  if (classType.includes('1-on-1') || classType.includes('Discovery Lesson')) return '⭐'
  if (classType.includes('Group Discovery') || classType.includes('Group Music') || classType.includes('Group Classes')) return '🎵'
  if (classType.includes('Kids Music')) return '🎹'
  if (classType.includes('Recording') || classType.includes('Teen')) return '🎙️'
  if (classType.includes('Piano')) return '🎹'
  return '🎶'
}

function getClassMonth(classType: string): 'june' | 'july-aug' | 'unknown' {
  const lower = classType.toLowerCase()
  if (lower.includes('june') || lower.includes('(june)') || lower.includes('– june')) return 'june'
  if (lower.includes('jul') || lower.includes('aug')) return 'july-aug'
  return 'june' // default to June for general classes
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PortalContent() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([])
  const [error, setError] = useState('')

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const resp = await fetch('/api/registrations')
      if (!resp.ok) throw new Error('Failed to load registrations')
      const data = await resp.json()
      setAllRegistrations(data.registrations || [])

      const normalEmail = email.trim().toLowerCase()
      const normalPhone = phone.replace(/\D/g, '')

      const matches = (data.registrations || []).filter((r: Registration) => {
        const rEmail = (r.parentEmail || '').trim().toLowerCase()
        const rPhone = (r.parentPhone || '').replace(/\D/g, '')
        if (normalEmail && rEmail === normalEmail) return true
        if (normalPhone && normalPhone.length >= 7 && rPhone.includes(normalPhone)) return true
        return false
      })

      setRegistrations(matches)
      setSubmitted(true)
    } catch {
      setError('Unable to load registrations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const parentName = registrations.length > 0 ? registrations[0].parentName : ''

  const childrenMap = useMemo(() => {
    const map = new Map<string, Registration[]>()
    for (const reg of registrations) {
      const name = reg.studentName.trim()
      if (!map.has(name)) map.set(name, [])
      map.get(name)!.push(reg)
    }
    return map
  }, [registrations])

  return (
    <main className="min-h-screen text-white" style={{ background: '#050505' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-lg font-bold tracking-wider" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>
          BASMA
        </Link>
        <span className="text-sm text-white/40">Parent Portal</span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {!submitted ? (
          /* ─── LOGIN FORM ────────────────────────────────────── */
          <div className="text-center">
            <div className="mb-8">
              <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">Parent Portal</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome, <span className="gradient-gold">Parent</span>
              </h1>
              <p className="text-white/40 max-w-md mx-auto">
                Look up your child&apos;s enrollment by entering the email or phone number you used during registration.
              </p>
            </div>

            <form onSubmit={handleLookup} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/20">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:border-[#c9a84c]/50 focus:outline-none transition"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || (!email.trim() && !phone.trim())}
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}
              >
                {loading ? 'Looking up...' : 'View My Enrollments'}
              </button>
            </form>

            <p className="mt-6 text-xs text-white/20">
              Having trouble? Call us at{' '}
              <a href="tel:7027887369" className="text-[#c9a84c]/60 hover:text-[#c9a84c]">(702) 788-7369</a>
            </p>
          </div>
        ) : registrations.length === 0 ? (
          /* ─── NO RESULTS ─────────────────────────────────── */
          <div className="text-center py-12">
            <div className="text-5xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Enrollments Found
            </h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any registrations matching that email or phone number.
              Please double-check and try again, or contact us for help.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => { setSubmitted(false); setEmail(''); setPhone('') }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition"
              >
                Try Again
              </button>
              <a
                href="tel:7027887369"
                className="px-6 py-2.5 rounded-xl text-sm font-medium transition"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}
              >
                Call (702) 788-7369
              </a>
            </div>
          </div>
        ) : (
          /* ─── DASHBOARD ──────────────────────────────────── */
          <div>
            <div className="mb-10">
              <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-2">Parent Portal</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome, <span className="gradient-gold">{parentName.split(' ')[0]}</span>
              </h1>
              <p className="text-white/40 text-sm">
                {registrations.length} enrollment{registrations.length !== 1 ? 's' : ''} across {childrenMap.size} child{childrenMap.size !== 1 ? 'ren' : ''}
              </p>
            </div>

            {/* Children cards */}
            {Array.from(childrenMap.entries()).map(([childName, regs]) => (
              <div key={childName} className="mb-8 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Child header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {childName}
                    </h3>
                    <p className="text-sm text-white/30">Age {regs[0].age ? Math.floor(regs[0].age) : '—'}</p>
                  </div>
                  <div className="text-3xl">{getClassEmoji(regs[0].classType)}</div>
                </div>

                {/* Classes */}
                {regs.map((reg) => {
                  const month = getClassMonth(reg.classType)
                  return (
                    <div key={reg._id} className="px-6 py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getClassEmoji(reg.classType)}</span>
                            <span className="font-medium text-white/90">{reg.classType}</span>
                          </div>
                          <p className="text-xs text-white/30">
                            Registered {formatDate(reg._creationTime || reg.createdAt || 0)}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          reg.paymentStatus === 'free' || reg.paymentStatus === 'N/A'
                            ? 'bg-green-500/10 text-green-400'
                            : reg.paymentStatus === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {reg.paymentStatus === 'free' || reg.paymentStatus === 'N/A' ? '✓ Free' : reg.paymentStatus === 'pending' ? '⏳ Payment Pending' : reg.paymentStatus}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* Medical & emergency info */}
                <div className="px-6 py-4 bg-white/[0.01]">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-white/25 mb-1 uppercase tracking-wider" style={{ fontSize: '10px' }}>Emergency Contact</p>
                      <p className="text-white/60">{regs[0].emergencyContactName}</p>
                      <p className="text-white/40">{formatPhone(regs[0].emergencyContactPhone)}</p>
                    </div>
                    <div>
                      <p className="text-white/25 mb-1 uppercase tracking-wider" style={{ fontSize: '10px' }}>Medical Info</p>
                      {regs[0].allergies && regs[0].allergies !== 'None' && regs[0].allergies !== 'No' && regs[0].allergies !== 'N/A' && (
                        <p className="text-orange-400/80">⚠️ Allergies: {regs[0].allergies}</p>
                      )}
                      {(!regs[0].allergies || regs[0].allergies === 'None' || regs[0].allergies === 'No' || regs[0].allergies === 'N/A') && (
                        <p className="text-white/40">No allergies reported</p>
                      )}
                      {regs[0].medications && regs[0].medications !== 'None' && regs[0].medications !== 'No' && regs[0].medications !== 'N/A' && (
                        <p className="text-white/40">Meds: {regs[0].medications}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick info */}
            <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: 'rgba(201, 168, 76, 0.05)', border: '1px solid rgba(201, 168, 76, 0.1)' }}>
              <h3 className="font-semibold mb-2 gradient-gold" style={{ fontFamily: "'Playfair Display', serif" }}>
                📍 Class Location
              </h3>
              <p className="text-white/50 text-sm">6787 W Tropicana Ave, Las Vegas</p>
              <p className="text-white/30 text-xs mt-1">Mon–Thu · June classes are FREE</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <a
                href="/enroll"
                className="px-6 py-2.5 rounded-xl text-sm font-medium transition"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #e4cc7a)', color: '#050505' }}
              >
                Enroll in Another Class
              </a>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); setPhone(''); setRegistrations([]) }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-6 border-t border-white/5 text-center">
        <p className="text-xs text-white/20">
          © 2026 BASMA Music Academy · <a href="/" className="text-[#c9a84c]/40 hover:text-[#c9a84c]">basmaworld.com</a>
        </p>
      </footer>
    </main>
  )
}
