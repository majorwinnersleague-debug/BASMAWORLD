export const dynamic = 'force-static'
export const revalidate = 86400

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-hidden">

      {/* ── Decorative background blobs ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute top-[30%] right-[-8%] w-80 h-80 rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
      </div>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/40 rounded-full px-5 py-2 mb-8 text-sm font-medium text-purple-300 shimmer">
          ✨ Music · Community · Opportunity
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="gradient-text">Basma</span>
          <span className="text-white">World</span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-200 mb-4 max-w-2xl leading-relaxed">
          Where artists <strong className="text-yellow-400">level up</strong>, communities <strong className="text-green-400">thrive</strong>, and dreams become <strong className="text-purple-400">reality</strong>.
        </p>
        <p className="text-base text-gray-400 mb-12 max-w-xl">
          Join thousands of students, creators & changemakers building their best life through music and community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/academy"
            className="pulse-cta inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🎵 Start Your Music Journey
          </a>
          <a
            href="/mwl"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 glow-gold"
          >
            🏆 Grow Your Brand
          </a>
          <a
            href="/hopes"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🤝 Get Support
          </a>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-wrap gap-6 justify-center mt-16 text-sm text-gray-400">
          <span className="flex items-center gap-2"><span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span> 500+ students</span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">🎉 <span>Las Vegas & Online</span></span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">🎵 <span>All ages welcome</span></span>
        </div>
      </section>

      {/* ── What is BasmaWorld ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Three Worlds. <span className="gradient-text">One Community.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to level up your artistry, grow your brand, and find real support.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Academy Card */}
          <a href="/academy" className="card-hover group block bg-gradient-to-b from-purple-900/50 to-purple-950/30 border border-purple-500/30 rounded-3xl p-8 text-center hover:border-purple-400/60">
            <div className="float text-6xl mb-6">🎵</div>
            <h3 className="text-2xl font-bold text-purple-300 mb-3">Music Academy</h3>
            <p className="text-gray-400 leading-relaxed mb-4">Master your instrument, build a killer brand, and perform with confidence. Lessons for all levels.</p>
            <span className="inline-block bg-purple-500/20 text-purple-300 rounded-full px-4 py-1 text-sm font-medium">
              Start Learning →
            </span>
          </a>

          {/* MWL Card */}
          <a href="/mwl" className="card-hover group block bg-gradient-to-b from-yellow-900/40 to-amber-950/20 border border-yellow-500/30 rounded-3xl p-8 text-center hover:border-yellow-400/60">
            <div className="float text-6xl mb-6" style={{ animationDelay: '1s' }}>🏆</div>
            <h3 className="text-2xl font-bold text-yellow-300 mb-3">Major Winners League</h3>
            <p className="text-gray-400 leading-relaxed mb-4">Content creation, music marketing, and brand strategy that gets real results. Let&apos;s grow.</p>
            <span className="inline-block bg-yellow-500/20 text-yellow-300 rounded-full px-4 py-1 text-sm font-medium">
              Work With Us →
            </span>
          </a>

          {/* Hopes Card */}
          <a href="/hopes" className="card-hover group block bg-gradient-to-b from-emerald-900/40 to-green-950/20 border border-emerald-500/30 rounded-3xl p-8 text-center hover:border-emerald-400/60">
            <div className="float text-6xl mb-6" style={{ animationDelay: '2s' }}>🤝</div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-3">Hopes Chance</h3>
            <p className="text-gray-400 leading-relaxed mb-4">Free, confidential resources for housing, jobs, mental health & more. No judgment. Just help.</p>
            <span className="inline-block bg-emerald-500/20 text-emerald-300 rounded-full px-4 py-1 text-sm font-medium">
              Find Resources →
            </span>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-12 px-6 border-t border-white/5">
        <p className="text-2xl font-bold gradient-text mb-2">BasmaWorld 🌍</p>
        <p className="text-gray-500 text-sm">Built with love in Las Vegas · Music · Community · Opportunity</p>
        <p className="text-gray-600 text-xs mt-3">© {new Date().getFullYear()} BasmaWorld. All rights reserved.</p>
      </footer>

    </main>
  )
}
