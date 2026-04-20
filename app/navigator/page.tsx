'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Match {
  id: string
  name: string
  type: string[]
  description: string | null
  address: string | null
  city: string | null
  zip: string | null
  phone: string | null
  website: string | null
  cost: string | null
  eligibility: string | null
  hours: Record<string, string | null>
  rating: number | null
  mapsLink: string | null
}

const NEEDS = [
  { key: 'Food', label: 'Food' },
  { key: 'Shelter', label: 'Shelter' },
  { key: 'Jobs', label: 'Jobs' },
  { key: 'Mental Health', label: 'Mental Health' },
  { key: 'Healthcare', label: 'Healthcare' },
  { key: 'Legal', label: 'Legal' },
  { key: 'Education', label: 'Education' },
  { key: 'Transportation', label: 'Transport' },
  { key: 'Youth Programs', label: 'Youth Programs' },
  { key: 'Crisis', label: 'Crisis Help' },
  { key: 'Financial', label: 'Financial Aid' },
  { key: 'Family Support', label: 'Family' },
]

export default function NavigatorPage() {
  const [step, setStep] = useState<'intake' | 'loading' | 'results'>('intake')
  const [zip, setZip] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [message, setMessage] = useState('')
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    )
  }

  const handleSubmit = async () => {
    if (!zip || selectedNeeds.length === 0) return

    setStep('loading')

    try {
      const res = await fetch('/api/navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip, needs: selectedNeeds }),
      })
      const data = await res.json()
      setMatches(data.matches || [])
      setMessage(data.message || '')
      setStep('results')
    } catch {
      setMessage('Something went wrong. Please try again.')
      setStep('results')
    }
  }

  return (
    <main className="min-h-screen text-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/[0.04] via-transparent to-transparent" />

        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </Link>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 mb-6 text-sm text-white/50 backdrop-blur-sm">
            Free · Confidential · One-time signup
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">MWL </span>
            <span className="gradient-gold">Navigator</span>
          </h1>
          <p className="text-xl text-white/60 mb-2 max-w-2xl mx-auto leading-relaxed">
            Your automated map to opportunity. Tell us what you need — we&apos;ll find it for you.
          </p>
          <p className="text-white/30 max-w-lg mx-auto text-sm">
            Major Winners League eliminates the friction of survival for young adults ages 16–30.
          </p>
        </div>
      </section>

      {/* ── Intake Form ────────────────────────────────────────────────────── */}
      {step === 'intake' && (
        <section className="px-6 pb-20 max-w-2xl mx-auto animate-fadeInUp">
          <div className="glass-gold rounded-2xl p-8 md:p-10">
            {/* ZIP */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-white/60 mb-3 tracking-wide uppercase">Your ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="e.g. 89101"
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xl font-mono placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/40 focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
                maxLength={5}
              />
            </div>

            {/* Needs Grid */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-white/60 mb-3 tracking-wide uppercase">What do you need help with?</label>
              <p className="text-xs text-white/25 mb-4">Select all that apply</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {NEEDS.map(({ key, label }) => {
                  const isSelected = selectedNeeds.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleNeed(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#c9a84c]/15 border border-[#c9a84c]/40 text-[#e4cc7a]'
                          : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
                      }`}
                    >
                      <span className="text-xs leading-tight text-center">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!zip || zip.length < 5 || selectedNeeds.length === 0}
              className="btn-gold w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Find My Resources
            </button>
          </div>
        </section>
      )}

      {/* ── Loading ────────────────────────────────────────────────────────── */}
      {step === 'loading' && (
        <section className="px-6 pb-20 max-w-2xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#c9a84c] border-t-transparent mx-auto mb-6" />
          <p className="text-white/60 text-lg font-medium animate-pulse">
            Scanning for resources near you...
          </p>
        </section>
      )}

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {step === 'results' && (
        <section className="px-6 pb-20 max-w-3xl mx-auto animate-fadeIn">
          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-lg font-medium text-white/70">{message}</p>
            <button
              onClick={() => { setStep('intake'); setMatches([]); setMessage('') }}
              className="mt-3 text-sm text-white/30 hover:text-white/50 underline transition"
            >
              ← Search again
            </button>
          </div>

          {/* Match Cards */}
          {matches.length > 0 && (
            <div className="space-y-4">
              {matches.map(match => {
                const isExpanded = expandedMatch === match.id
                return (
                  <div
                    key={match.id}
                    className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12]"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{match.name}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {match.type.map((t: string) => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#e4cc7a]/80">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {match.cost && (
                          <span className="text-sm font-bold text-[#c9a84c] whitespace-nowrap">{match.cost}</span>
                        )}
                      </div>

                      {match.description && (
                        <p className="text-sm text-white/40 mt-2">{match.description}</p>
                      )}

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {match.mapsLink && (
                          <a
                            href={match.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-white/50 hover:text-white/70 transition"
                          >
                            Directions
                          </a>
                        )}
                        {match.phone && (
                          <a
                            href={`tel:${match.phone}`}
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-white/50 hover:text-white/70 transition"
                          >
                            Call
                          </a>
                        )}
                        {match.website && (
                          <a
                            href={match.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-white/50 hover:text-white/70 transition"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] space-y-3 animate-fadeIn">
                        {match.address && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Address</p>
                            <p className="text-sm text-white/60">{match.address}</p>
                          </div>
                        )}
                        {match.eligibility && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Eligibility</p>
                            <p className="text-sm text-white/60">{match.eligibility}</p>
                          </div>
                        )}
                        {match.rating && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Community Rating</p>
                            <p className="text-sm text-white/60">{match.rating}/5</p>
                          </div>
                        )}
                        {Object.values(match.hours).some(h => h) && (
                          <div>
                            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Hours</p>
                            <div className="grid grid-cols-2 gap-1 text-xs text-white/40">
                              {Object.entries(match.hours)
                                .filter(([, v]) => v)
                                .map(([day, hours]) => (
                                  <div key={day}>
                                    <span className="capitalize font-medium text-white/50">{day}:</span> {hours}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Feedback */}
          {matches.length > 0 && (
            <div className="mt-8 glass rounded-2xl p-6 text-center">
              <p className="text-white/60 font-medium mb-2">Did you connect? Was it helpful?</p>
              <p className="text-white/30 text-sm mb-4">Your feedback helps us improve resources for everyone.</p>
              <div className="flex justify-center gap-3">
                <button className="px-6 py-2 rounded-lg bg-white/[0.06] text-white/60 hover:bg-white/[0.10] text-sm font-medium transition border border-white/[0.06]">
                  Yes, it helped
                </button>
                <button className="px-6 py-2 rounded-lg bg-white/[0.03] text-white/40 hover:bg-white/[0.06] text-sm font-medium transition border border-white/[0.06]">
                  Not what I needed
                </button>
              </div>
            </div>
          )}

          {/* Bridge to Academy */}
          <div className="mt-8 glass-gold rounded-2xl p-6 text-center">
            <p className="text-white/70 font-medium mb-2">Ready to level up?</p>
            <p className="text-white/40 text-sm mb-4">
              Once your basics are covered, unlock free music lessons through BASMA Academy.
            </p>
            <Link
              href="/academy"
              className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm"
            >
              Explore the Academy
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
