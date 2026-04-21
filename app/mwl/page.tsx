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
        <a href="/" className="text-white/40 hover:text-[#c9a84c] transition text-sm">
          ← Back
        </a>
      </div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="text-center px-6 py-16 max-w-3xl mx-auto">
        <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-6">Content · Marketing · Brand Strategy</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="gradient-gold">Major Winners</span>
          <br />
          <span className="text-white">League</span>
        </h1>
        <p className="text-lg text-white/45 mb-4 max-w-xl mx-auto leading-relaxed">
          Content creation and marketing that actually <strong className="text-[#c9a84c]">gets results</strong>.
        </p>
        <p className="text-white/25 max-w-md mx-auto text-sm">
          From TikTok strategy to full brand identity — we help artists and businesses show up loud, proud, and profitable.
        </p>
      </section>

      {/* ── Services ─────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {services.map(s => (
            <span key={s} className="bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 text-white/35 text-sm">
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="divider max-w-sm mx-auto" />

      {/* ── Contact Form ─────────────────────────────── */}
      <section className="px-6 py-20 max-w-md mx-auto">
        <div className="card-minimal rounded-xl p-8">
          {submitted ? (
            <div className="text-center py-6">
              <h3 className="text-xl font-semibold text-[#c9a84c] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                You&apos;re in. We&apos;ll be in touch soon.
              </h3>
              <p className="text-white/30 text-sm">Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Let&apos;s Work <span className="gradient-gold">Together</span>
              </h2>
              <p className="text-white/30 text-center text-xs mb-8">Tell us about your vision and we&apos;ll make it happen.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="bg-white/[0.03] border border-white/[0.08] focus:border-[#c9a84c]/30 rounded-xl px-5 py-3.5 text-white text-sm placeholder-white/15 outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="bg-white/[0.03] border border-white/[0.08] focus:border-[#c9a84c]/30 rounded-xl px-5 py-3.5 text-white text-sm placeholder-white/15 outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Company / Artist Name"
                  className="bg-white/[0.03] border border-white/[0.08] focus:border-[#c9a84c]/30 rounded-xl px-5 py-3.5 text-white text-sm placeholder-white/15 outline-none transition"
                />
                <textarea
                  placeholder="Tell us about your project..."
                  className="bg-white/[0.03] border border-white/[0.08] focus:border-[#c9a84c]/30 rounded-xl px-5 py-3.5 text-white text-sm placeholder-white/15 outline-none transition h-28 resize-none"
                />
                <button
                  type="submit"
                  className="btn-gold py-3.5 rounded-xl text-sm tracking-wide mt-2"
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
