'use client'

import { useState } from 'react'

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Facebook', 'LinkedIn']
const NICHES = ['Music', 'Fitness', 'Education', 'Business', 'Lifestyle', 'Comedy', 'Other']
const FREQUENCIES = ['1x / week', '3x / week', 'Daily', 'Multiple per day']
const TONES = ['Funny / Casual', 'Professional', 'Inspirational', 'Educational']

function getRecommendedPackage(data: SurveyData): 'starter' | 'growth' | 'elite' {
  const platformCount = data.platforms.length
  const wantsBranding = data.brandedTemplates
  const highFreq = data.frequency === 'Daily' || data.frequency === 'Multiple per day'

  if (wantsBranding || (platformCount >= 4 && highFreq)) return 'elite'
  if (platformCount >= 3 || highFreq) return 'growth'
  return 'starter'
}

interface SurveyData {
  platforms: string[]
  niche: string
  frequency: string
  brandDesc: string
  hasVideos: boolean | null
  tone: string
  captions: boolean | null
  brandedTemplates: boolean | null
}

const EMPTY: SurveyData = {
  platforms: [],
  niche: '',
  frequency: '',
  brandDesc: '',
  hasVideos: null,
  tone: '',
  captions: null,
  brandedTemplates: null,
}

const PACKAGES = {
  starter: {
    name: 'Starter',
    price: '$97',
    period: '/mo',
    desc: 'Perfect for getting started on one platform.',
    features: ['4 videos/month', '1 platform', 'AI-written captions', 'Opus Clip processing', 'Email notifications'],
    color: 'border-white/20',
    badge: null,
  },
  growth: {
    name: 'Growth',
    price: '$197',
    period: '/mo',
    desc: "For creators ready to scale across platforms.",
    features: ['8 videos/month', 'Up to 3 platforms', 'AI captions per platform', 'Scheduled posting', 'Client dashboard'],
    color: 'border-[#8B5CF6]',
    badge: 'Recommended',
  },
  elite: {
    name: 'Elite',
    price: '$497',
    period: '/mo',
    desc: 'Full automation. Every platform. No limits.',
    features: ['Unlimited videos', 'All platforms', 'Branded clip templates', 'Priority processing', 'Analytics dashboard'],
    color: 'border-[#F59E0B]/60',
    badge: 'Best Value',
  },
}

export default function SocialMediaPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SurveyData>(EMPTY)
  const [loading, setLoading] = useState(false)

  const togglePlatform = (p: string) => {
    setData(d => ({
      ...d,
      platforms: d.platforms.includes(p)
        ? d.platforms.filter(x => x !== p)
        : [...d.platforms, p],
    }))
  }

  const step1Valid = data.platforms.length > 0 && data.niche && data.frequency && data.brandDesc.trim().length > 5
  const step2Valid = data.hasVideos !== null && data.tone && data.captions !== null && data.brandedTemplates !== null

  const recommended = getRecommendedPackage(data)

  const handleCheckout = async (tier: 'starter' | 'growth' | 'elite') => {
    setLoading(true)
    try {
      const res = await fetch('/api/social-media/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, surveyData: data }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-3">Social Media — Done For You</h1>
        <p className="text-white/60 text-lg">You upload a video. We handle everything else.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${s <= step ? 'bg-[#8B5CF6]' : 'bg-white/10'}`} />
            <span className={`text-xs ${s <= step ? 'text-[#8B5CF6]' : 'text-white/30'}`}>
              {s === 1 ? 'Your Goals' : s === 2 ? 'Content Style' : 'Your Plan'}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-8">
          {/* Platforms */}
          <div>
            <label className="block text-white font-semibold mb-3">Which platforms do you want to post on?</label>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    data.platforms.includes(p)
                      ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="block text-white font-semibold mb-3">What&apos;s your content niche?</label>
            <div className="flex flex-wrap gap-3">
              {NICHES.map(n => (
                <button
                  key={n}
                  onClick={() => setData(d => ({ ...d, niche: n }))}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    data.niche === n
                      ? 'bg-[#F59E0B] border-[#F59E0B] text-black font-bold'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-white font-semibold mb-3">How often do you want to post?</label>
            <div className="grid grid-cols-2 gap-3">
              {FREQUENCIES.map(f => (
                <button
                  key={f}
                  onClick={() => setData(d => ({ ...d, frequency: f }))}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    data.frequency === f
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Brand desc */}
          <div>
            <label className="block text-white font-semibold mb-3">Describe your brand in one sentence</label>
            <input
              type="text"
              value={data.brandDesc}
              onChange={e => setData(d => ({ ...d, brandDesc: e.target.value }))}
              placeholder="e.g. I teach jazz piano to adults who thought it was too late to learn"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            className="w-full py-4 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all disabled:opacity-30 disabled:cursor-not-allowed glow-purple"
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Has videos */}
          <div>
            <label className="block text-white font-semibold mb-3">Do you have existing videos to repurpose?</label>
            <div className="grid grid-cols-2 gap-3">
              {['Yes', 'No'].map(v => (
                <button
                  key={v}
                  onClick={() => setData(d => ({ ...d, hasVideos: v === 'Yes' }))}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    data.hasVideos === (v === 'Yes')
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-white font-semibold mb-3">What&apos;s your content tone?</label>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setData(d => ({ ...d, tone: t }))}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    data.tone === t
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-white'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Captions */}
          <div>
            <label className="block text-white font-semibold mb-3">Do you want auto-captions on your clips?</label>
            <div className="grid grid-cols-2 gap-3">
              {['Yes', 'No'].map(v => (
                <button
                  key={v}
                  onClick={() => setData(d => ({ ...d, captions: v === 'Yes' }))}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    data.captions === (v === 'Yes')
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Branded templates */}
          <div>
            <label className="block text-white font-semibold mb-3">Do you want branded templates? (logo + colors on clips)</label>
            <div className="grid grid-cols-2 gap-3">
              {['Yes', 'No'].map(v => (
                <button
                  key={v}
                  onClick={() => setData(d => ({ ...d, brandedTemplates: v === 'Yes' }))}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    data.brandedTemplates === (v === 'Yes')
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-xl font-bold text-white/60 border border-white/10 hover:border-white/30 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="flex-[2] py-4 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              See My Plan →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Package Recommendation */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-full px-4 py-1 text-[#c084fc] text-sm font-medium mb-4">
              Based on your answers
            </div>
            <h2 className="text-3xl font-bold text-white">Your Recommended Plan</h2>
            <p className="text-white/50 mt-2">
              {data.platforms.length} platform{data.platforms.length > 1 ? 's' : ''} · {data.frequency} · {data.tone}
            </p>
          </div>

          <div className="space-y-4">
            {(Object.entries(PACKAGES) as [keyof typeof PACKAGES, typeof PACKAGES['starter']][]).map(([tier, pkg]) => {
              const isRec = tier === recommended
              return (
                <div
                  key={tier}
                  className={`rounded-2xl border p-6 transition-all ${pkg.color} ${isRec ? 'bg-[#8B5CF6]/10 scale-[1.02]' : 'bg-white/3'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        {isRec && (
                          <span className="bg-[#8B5CF6] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            ✦ Recommended
                          </span>
                        )}
                        {pkg.badge && !isRec && (
                          <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold px-2 py-0.5 rounded-full">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm mt-1">{pkg.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-white">{pkg.price}</span>
                      <span className="text-white/40 text-sm">{pkg.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="text-[#22C55E]">✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(tier)}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold transition-all text-sm ${
                      isRec
                        ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white glow-purple'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    } disabled:opacity-50`}
                  >
                    {loading ? 'Processing…' : `Get ${pkg.name} — ${pkg.price}/mo`}
                  </button>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            ← Change my answers
          </button>
        </div>
      )}
    </main>
  )
}
