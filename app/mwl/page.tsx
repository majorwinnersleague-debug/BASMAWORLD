'use client'
import { useState } from 'react'

export default function MWL() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: wire to /api/contact
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen text-white">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </div>

      {/* Back nav */}
      <div className="px-8 pt-8">
        <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-300 transition text-sm">
          ← Back to BasmaWorld
        </a>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto">
        <div className="float text-8xl mb-6">🏆</div>
        <div className="inline-flex items-center gap-2 bg-yellow-900/40 border border-yellow-500/40 rounded-full px-5 py-2 mb-6 text-sm text-yellow-300">
          🚀 Content · Marketing · Brand Strategy
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Major Winners
          </span>
          <br />
          <span className="text-white">League</span>
        </h1>
        <p className="text-xl text-yellow-200 mb-4 max-w-2xl mx-auto leading-relaxed">
          Content creation and marketing that actually <strong className="text-yellow-400">gets results</strong>. Let&apos;s grow your brand. 📈
        </p>
        <p className="text-gray-400 max-w-xl mx-auto">
          From TikTok strategy to full brand identity — we help artists and businesses show up loud, proud, and profitable.
        </p>
      </section>

      {/* Services strip */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {['🎬 Video Content', '📱 Social Strategy', '🎨 Brand Identity', '🎵 Music Marketing', '📧 Email Campaigns', '📊 Analytics'].map(s => (
            <span key={s} className="bg-yellow-900/30 border border-yellow-600/30 rounded-full px-5 py-2 text-yellow-200 text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="px-6 pb-20 max-w-xl mx-auto">
        <div
          className="rounded-3xl p-10"
          style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(249,115,22,0.08))', border: '1px solid rgba(251,191,36,0.3)' }}
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-3">You&apos;re in! We&apos;ll be in touch soon.</h3>
              <p className="text-gray-400">Our team will reach out within 24 hours. Get ready to WIN. 🏆</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Let&apos;s Work Together! 🤝</h2>
              <p className="text-gray-400 text-center text-sm mb-8">Tell us about your vision and we&apos;ll make it happen.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name ✨"
                  required
                  className="bg-black/30 border border-yellow-700/40 focus:border-yellow-500 rounded-xl px-5 py-4 text-white placeholder-gray-500 outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email Address 📧"
                  required
                  className="bg-black/30 border border-yellow-700/40 focus:border-yellow-500 rounded-xl px-5 py-4 text-white placeholder-gray-500 outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Company / Artist Name 🎤"
                  className="bg-black/30 border border-yellow-700/40 focus:border-yellow-500 rounded-xl px-5 py-4 text-white placeholder-gray-500 outline-none transition"
                />
                <textarea
                  placeholder="Tell us about your project... What are you building? 🚀"
                  className="bg-black/30 border border-yellow-700/40 focus:border-yellow-500 rounded-xl px-5 py-4 text-white placeholder-gray-500 outline-none transition h-32 resize-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-black py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 glow-gold"
                >
                  Let&apos;s Go! 🏆
                </button>
              </form>
            </>
          )}
        </div>
      </section>

    </main>
  )
}
