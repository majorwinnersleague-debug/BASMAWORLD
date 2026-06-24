'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MarketingPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    website: '',
    services: [] as string[],
    budget: '',
    details: '',
  })

  const serviceOptions = [
    'Social Media Management',
    'Content Creation (Photo/Video)',
    'Brand Identity & Logo',
    'Music Marketing & Promotion',
    'Email Campaigns',
    'SEO & Website',
    'Paid Ads (Facebook/Instagram/TikTok)',
    'Influencer Marketing',
    'Other',
  ]

  const budgetOptions = [
    'Under $500/mo',
    '$500 – $1,000/mo',
    '$1,000 – $2,500/mo',
    '$2,500 – $5,000/mo',
    '$5,000+/mo',
    'Not sure yet',
  ]

  function toggleService(s: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter(x => x !== s)
        : [...prev.services, s],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'marketing',
          parentName: form.name,
          email: form.email,
          phone: form.phone,
          notes: `Business: ${form.business}\nWebsite: ${form.website || 'N/A'}\nServices: ${form.services.join(', ')}\nBudget: ${form.budget}\nDetails: ${form.details}`,
        }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const gold = '#c9a84c'
  const inputCls = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/40 transition'

  if (submitted) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center" style={{ background: '#0D0118' }}>
        <div className="text-center px-6 max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: gold }}>Thank You!</h1>
          <p className="text-white/50 text-sm mb-6">We&apos;ve received your marketing consultation request. Our team will reach out within 24 hours to discuss how we can help grow your brand.</p>
          <Link href="/" className="text-sm text-[#c9a84c]/70 hover:text-[#c9a84c] underline">← Back to Home</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white" style={{ background: '#0D0118' }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-2xl mx-auto">
        <Link href="/" className="text-lg font-bold" style={{ color: gold, fontFamily: "'Playfair Display', serif" }}>BASMA</Link>
        <Link href="/contact" className="text-sm text-white/40 hover:text-white/60 transition">← Contact</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: `${gold}80` }}>Marketing Consultation</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Let&apos;s <span style={{ color: gold }}>Grow</span> Your Brand
          </h1>
          <p className="text-white/35 text-sm max-w-md mx-auto">
            Tell us about your business and marketing needs. We&apos;ll put together a custom strategy to help you stand out.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Your Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={inputCls}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Phone + Business */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Phone *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className={inputCls}
                placeholder="(702) 555-0000"
              />
            </div>
            <div>
              <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Business Name *</label>
              <input
                type="text"
                required
                value={form.business}
                onChange={e => setForm(p => ({ ...p, business: e.target.value }))}
                className={inputCls}
                placeholder="Your business or brand name"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Website / Social Media (optional)</label>
            <input
              type="text"
              value={form.website}
              onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              className={inputCls}
              placeholder="https://yourwebsite.com or @yoursocial"
            />
          </div>

          {/* Services */}
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">What services are you interested in?</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    form.services.includes(s)
                      ? 'bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15'
                  }`}
                >
                  {form.services.includes(s) && '✓ '}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-2 block">Monthly Budget</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {budgetOptions.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, budget: b }))}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                    form.budget === b
                      ? 'bg-[#c9a84c]/20 border-[#c9a84c]/40 text-[#c9a84c]'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/15'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="text-xs text-white/30 uppercase tracking-wider mb-1.5 block">Tell us more (optional)</label>
            <textarea
              value={form.details}
              onChange={e => setForm(p => ({ ...p, details: e.target.value }))}
              className={`${inputCls} min-h-[100px] resize-y`}
              placeholder="What are your goals? Any specific challenges you're facing?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            style={{ background: `linear-gradient(135deg, ${gold}, #e4cc7a)`, color: '#1a1a2e' }}
          >
            {loading ? 'Submitting...' : 'Request Consultation →'}
          </button>

          <p className="text-white/20 text-xs text-center">
            Or call us directly: <a href="tel:7027887369" className="text-[#c9a84c]/60 hover:text-[#c9a84c]">(702) 788-7369</a>
          </p>
        </form>
      </div>
    </main>
  )
}
