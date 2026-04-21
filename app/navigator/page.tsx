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

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6">
        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <Link href="/" className="text-white/40 hover:text-[#c9a84c] transition text-sm">
            ← Back
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-6">Free · Confidential · One-time signup</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">MWL </span>
            <span className="gradient-gold">Navigator</span>
          </h1>
          <p className="text-lg text-white/45 mb-2 max-w-xl mx-auto leading-relaxed">
            Your automated map to opportunity. Tell us what you need — we&apos;ll find it for you.
          </p>
          <p className="text-white/25 max-w-md mx-auto text-sm">
            Major Winners League eliminates the friction of survival for young adults ages 16–30.
          </p>
        </div>
      </section>

      {/* ── Intake Form ──────────────────────────────── */}
      {step === 'intake' && (
        <section className="px-6 pb-20 max-w-xl mx-auto">
          <div className="card-minimal rounded-xl p-8">
            {/* ZIP */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-white/40 mb-3 tracking-wide uppercase">Your ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="e.g. 89101"
                className="w-full px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-lg font-mono placeholder:text-white/15 focus:outline-none focus:border-[#c9a84c]/30 transition"
                maxLength={5}
              />
            </div>

            {/* Needs Grid */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-white/40 mb-3 tracking-wide uppercase">What do you need help with?</label>
              <p className="text-[10px] text-white/20 mb-4">Select all that apply</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {NEEDS.map(({ key, label }) => {
                  const isSelected = selectedNeeds.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleNeed(key)}
                      className={`p-3 rounded-xl text-xs transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c]'
                          : 'card-minimal text-white/35 hover:text-white/50'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!zip || zip.length < 5 || selectedNeeds.length === 0}
              className="btn-gold w-full py-3.5 rounded-xl text-sm tracking-wide disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Find My Resources
            </button>
          </div>
        </section>
      )}

      {/* ── Loading ──────────────────────────────────── */}
      {step === 'loading' && (
        <section className="px-6 pb-20 max-w-xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#c9a84c] border-t-transparent mx-auto mb-6" />
          <p className="text-white/40 text-sm">Scanning for resources near you...</p>
        </section>
      )}

      {/* ── Results ──────────────────────────────────── */}
      {step === 'results' && (
        <section className="px-6 pb-20 max-w-2xl mx-auto">
          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-base text-white/50">{message}</p>
            <button
              onClick={() => { setStep('intake'); setMatches([]); setMessage('') }}
              className="mt-3 text-xs text-white/25 hover:text-white/40 underline transition"
            >
              ← Search again
            </button>
          </div>

          {/* Match Cards */}
          {matches.length > 0 && (
            <div className="space-y-3">
              {matches.map(match => {
                const isExpanded = expandedMatch === match.id
                return (
                  <div
                    key={match.id}
                    className="card-minimal rounded-xl overflow-hidden transition-all duration-200"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-sm">{match.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.type.map((t: string) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c]/60">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {match.cost && (
                          <span className="text-xs text-[#c9a84c] whitespace-nowrap">{match.cost}</span>
                        )}
                      </div>

                      {match.description && (
                        <p className="text-xs text-white/30 mt-2">{match.description}</p>
                      )}

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {match.mapsLink && (
                          <a
                            href={match.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/35 hover:text-white/50 transition"
                          >
                            Directions
                          </a>
                        )}
                        {match.phone && (
                          <a
                            href={`tel:${match.phone}`}
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/35 hover:text-white/50 transition"
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
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/35 hover:text-white/50 transition"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] space-y-3">
                        {match.address && (
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Address</p>
                            <p className="text-xs text-white/50">{match.address}</p>
                          </div>
                        )}
                        {match.eligibility && (
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Eligibility</p>
                            <p className="text-xs text-white/50">{match.eligibility}</p>
                          </div>
                        )}
                        {match.rating && (
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Community Rating</p>
                            <p className="text-xs text-white/50">{match.rating}/5</p>
                          </div>
                        )}
                        {Object.values(match.hours).some(h => h) && (
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Hours</p>
                            <div className="grid grid-cols-2 gap-1 text-[10px] text-white/30">
                              {Object.entries(match.hours)
                                .filter(([, v]) => v)
                                .map(([day, hours]) => (
                                  <div key={day}>
                                    <span className="capitalize text-white/40">{day}:</span> {hours}
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
            <div className="mt-6 card-minimal rounded-xl p-5 text-center">
              <p className="text-white/40 text-sm mb-2">Was this helpful?</p>
              <div className="flex justify-center gap-3">
                <button className="px-5 py-2 rounded-lg card-minimal text-white/40 text-xs hover:text-white/60 transition">
                  Yes, it helped
                </button>
                <button className="px-5 py-2 rounded-lg card-minimal text-white/30 text-xs hover:text-white/50 transition">
                  Not what I needed
                </button>
              </div>
            </div>
          )}

          <div className="divider max-w-sm mx-auto mt-8" />

          {/* Bridge to Academy */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-2">Ready to level up?</p>
            <p className="text-white/25 text-xs mb-4">
              Once your basics are covered, unlock free music lessons through BASMA Academy.
            </p>
            <Link href="/academy" className="btn-gold px-6 py-2.5 rounded-full text-sm tracking-wide">
              Explore the Academy
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
