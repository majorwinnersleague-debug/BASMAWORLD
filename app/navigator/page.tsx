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
  { key: 'Food', emoji: '🍎', label: 'Food' },
  { key: 'Shelter', emoji: '🏠', label: 'Shelter' },
  { key: 'Jobs', emoji: '💼', label: 'Jobs' },
  { key: 'Mental Health', emoji: '💙', label: 'Mental Health' },
  { key: 'Healthcare', emoji: '❤️‍🩹', label: 'Healthcare' },
  { key: 'Legal', emoji: '⚖️', label: 'Legal' },
  { key: 'Education', emoji: '📚', label: 'Education' },
  { key: 'Transportation', emoji: '🚌', label: 'Transport' },
  { key: 'Youth Programs', emoji: '🌟', label: 'Youth Programs' },
  { key: 'Crisis', emoji: '🆘', label: 'Crisis Help' },
  { key: 'Financial', emoji: '💰', label: 'Financial Aid' },
  { key: 'Family Support', emoji: '👨‍👩‍👧', label: 'Family' },
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
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-transparent to-transparent" />

        <div className="absolute top-0 left-0 px-8 pt-8 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-yellow-300 transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
            ← Back to BasmaWorld
          </Link>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-900/60 border border-yellow-500/40 rounded-full px-5 py-2 mb-6 text-sm text-yellow-300 backdrop-blur-sm">
            🗺️ Free · Confidential · One-time signup
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-white">MWL </span>
            <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Navigator
            </span>
          </h1>
          <p className="text-xl text-yellow-200/80 mb-2 max-w-2xl mx-auto leading-relaxed">
            Your automated map to opportunity. Tell us what you need — we&apos;ll find it for you.
          </p>
          <p className="text-white/40 max-w-lg mx-auto text-sm">
            Major Winners League eliminates the friction of survival for young adults ages 16–30.
          </p>
        </div>
      </section>

      {/* Intake Form */}
      {step === 'intake' && (
        <section className="px-6 pb-20 max-w-2xl mx-auto">
          <div className="rounded-3xl p-8 md:p-10" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(249,115,22,0.08))', border: '1px solid rgba(251,191,36,0.3)' }}>
            {/* ZIP */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white/80 mb-3">Your ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={e => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="e.g. 89101"
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-yellow-500/20 text-white text-xl font-mono placeholder:text-white/20 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                maxLength={5}
              />
            </div>

            {/* Needs Grid */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white/80 mb-3">What do you need help with?</label>
              <p className="text-xs text-white/30 mb-4">Select all that apply</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {NEEDS.map(({ key, emoji, label }) => {
                  const isSelected = selectedNeeds.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => toggleNeed(key)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-yellow-500/20 border-2 border-yellow-400/60 text-yellow-200 scale-105'
                          : 'bg-white/5 border-2 border-transparent text-white/50 hover:bg-white/10 hover:text-white/70'
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
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
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transform hover:scale-[1.02]"
            >
              🔍 Find My Resources
            </button>
          </div>
        </section>
      )}

      {/* Loading */}
      {step === 'loading' && (
        <section className="px-6 pb-20 max-w-2xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent mx-auto mb-6" />
          <p className="text-yellow-200 text-lg font-medium animate-pulse">
            Major Winners League is scanning for resources near you...
          </p>
        </section>
      )}

      {/* Results */}
      {step === 'results' && (
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-lg font-medium text-yellow-200">{message}</p>
            <button
              onClick={() => { setStep('intake'); setMatches([]); setMessage('') }}
              className="mt-3 text-sm text-white/40 hover:text-white/60 underline transition"
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
                    className="rounded-2xl bg-gradient-to-br from-yellow-900/20 to-orange-950/10 border border-yellow-500/20 overflow-hidden transition-all duration-300 hover:border-yellow-400/40"
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
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {match.cost && (
                          <span className="text-sm font-bold text-emerald-400 whitespace-nowrap">{match.cost}</span>
                        )}
                      </div>

                      {match.description && (
                        <p className="text-sm text-white/50 mt-2">{match.description}</p>
                      )}

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {match.mapsLink && (
                          <a
                            href={match.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white/70 hover:text-white transition"
                          >
                            📍 Get Directions
                          </a>
                        )}
                        {match.phone && (
                          <a
                            href={`tel:${match.phone}`}
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white/70 hover:text-white transition"
                          >
                            📞 Call
                          </a>
                        )}
                        {match.website && (
                          <a
                            href={match.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white/70 hover:text-white transition"
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-white/10 space-y-3">
                        {match.address && (
                          <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Address</p>
                            <p className="text-sm text-white/70">{match.address}</p>
                          </div>
                        )}
                        {match.eligibility && (
                          <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Eligibility</p>
                            <p className="text-sm text-white/70">{match.eligibility}</p>
                          </div>
                        )}
                        {match.rating && (
                          <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Community Rating</p>
                            <p className="text-sm text-white/70">{'⭐'.repeat(Math.round(match.rating))} ({match.rating}/5)</p>
                          </div>
                        )}
                        {Object.values(match.hours).some(h => h) && (
                          <div>
                            <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Hours</p>
                            <div className="grid grid-cols-2 gap-1 text-xs text-white/50">
                              {Object.entries(match.hours)
                                .filter(([, v]) => v)
                                .map(([day, hours]) => (
                                  <div key={day}>
                                    <span className="capitalize font-medium text-white/60">{day}:</span> {hours}
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

          {/* Follow-up */}
          {matches.length > 0 && (
            <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(52,211,153,0.2)' }}>
              <p className="text-emerald-200 font-medium mb-2">Did you connect? Was it helpful?</p>
              <p className="text-white/40 text-sm mb-4">Your feedback helps us improve resources for everyone.</p>
              <div className="flex justify-center gap-3">
                <button className="px-6 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-sm font-medium transition">
                  👍 Yes, it helped!
                </button>
                <button className="px-6 py-2 rounded-lg bg-white/10 text-white/50 hover:bg-white/15 text-sm font-medium transition">
                  👎 Not what I needed
                </button>
              </div>
            </div>
          )}

          {/* Bridge to Academy */}
          <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(251,191,36,0.08))', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-purple-200 font-medium mb-2">Ready to level up? 🎵</p>
            <p className="text-white/40 text-sm mb-4">
              Once your basics are covered, unlock free music lessons through BASMA Academy.
            </p>
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition"
            >
              🎶 Explore the Academy
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
