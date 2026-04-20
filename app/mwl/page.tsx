'use client'
import { useState } from 'react'

export default function MWL() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire to /api/contact
    setSubmitted(true)
  }

  const services = [
    'Video Content',
    'Social Strategy',
    'Brand Identity',
    'Music Marketing',
    'Email Campaigns',
    'Analytics',
  ]

  return (
    <main className="min-h-screen text-white">

      {/* Back nav */}
      <div className="px-8 pt-8">
        <a href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm">
          ← Back to BasmaWorld
        </a>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 mb-6 text-sm text-white/50">
          Content · Marketing · Brand Strategy
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="gradient-gold">Major Winners</span>
          <br />
          <span className="text-white">League</span>
        </h1>
        <p className="text-xl text-white/60 mb-4 max-w-2xl mx-auto leading-relaxed">
          Content creation and marketing that actually <strong className="text-[#c9a84c]">gets results</strong>. Let&apos;s grow your brand.
        </p>
        <p className="text-white/30 max-w-xl mx-auto">
          From TikTok strategy to full brand identity — we help artists and businesses show up loud, proud, and profitable.
        </p>
      </section>

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {services.map(s => (
            <span key={s} className="bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-2 text-white/50 text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Contact Form ───────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-xl mx-auto">
        <div className="glass-gold rounded-2xl p-10">
          {submitted ? (
            <div className="text-center py-8 animate-fadeIn">
              <h3 className="text-2xl font-bold text-[#e4cc7a] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                You&apos;re in. We&apos;ll be in touch soon.
              </h3>
              <p className="text-white/40">Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Let&apos;s Work Together
              </h2>
              <p className="text-white/40 text-center text-sm mb-8">Tell us about your vision and we&apos;ll make it happen.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="bg-black/30 border border-white/[0.08] focus:border-[#c9a84c]/40 focus:ring-2 focus:ring-[#c9a84c]/10 rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="bg-black/30 border border-white/[0.08] focus:border-[#c9a84c]/40 focus:ring-2 focus:ring-[#c9a84c]/10 rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Company / Artist Name"
                  className="bg-black/30 border border-white/[0.08] focus:border-[#c9a84c]/40 focus:ring-2 focus:ring-[#c9a84c]/10 rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none transition"
                />
                <textarea
                  placeholder="Tell us about your project..."
                  className="bg-black/30 border border-white/[0.08] focus:border-[#c9a84c]/40 focus:ring-2 focus:ring-[#c9a84c]/10 rounded-xl px-5 py-4 text-white placeholder-white/20 outline-none transition h-32 resize-none"
                />
                <button
                  type="submit"
                  className="btn-gold py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Get Started
                </button>
              </form>
            </>
          )}
        </div>
      </section>

    </main>
  )
}
