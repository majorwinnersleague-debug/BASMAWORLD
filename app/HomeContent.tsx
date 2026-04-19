'use client'

import Link from 'next/link'
import ExpandableSection from '@/components/ExpandableSection'

export default function HomeContent() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0a0a] text-white">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-black" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
              Las Vegas · Music · Marketing · Community
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BasmaWorld
              </span>
            </h1>
            <p className="text-white/50 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-4">
              We help you <strong className="text-white">grow your brand</strong>, <strong className="text-white">learn music</strong>, and <strong className="text-white">build community</strong> — powered by real people and AI.
            </p>
            <p className="text-white/30 text-sm mb-10">
              Founded by Basma Awada · 300K+ community · Las Vegas, NV
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/mwm" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90 shadow-lg">
                📱 Grow My Brand
              </Link>
              <Link href="/basma" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90 shadow-lg">
                🎵 Learn Music
              </Link>
              <Link href="/mwl" className="bg-gradient-to-r from-yellow-500 to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition hover:opacity-90 shadow-lg">
                🏆 Join the League
              </Link>
            </div>
          </div>
        </section>

        {/* ── What We Offer ───────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Can We Do For You?</h2>
            <p className="text-white/40 max-w-xl mx-auto">Three brands. One mission. Whether you need marketing, music education, or community — we&apos;ve got you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* MWM Card */}
            <Link href="/mwm" className="group bg-white/[0.02] border border-blue-500/20 hover:border-blue-400/50 rounded-2xl p-6 transition-all hover:bg-blue-500/5">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition mb-2">
                Major Winners Marketing
              </h3>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Social Media Services</p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                We grow your social media, create content, and build your brand presence. Real results. AI-assisted.
              </p>
              <ul className="space-y-1.5 text-sm text-white/40">
                <li>✓ Social media management</li>
                <li>✓ Content creation &amp; strategy</li>
                <li>✓ AI-powered marketing bot</li>
              </ul>
              <p className="text-blue-400 text-sm font-semibold mt-4 group-hover:translate-x-1 transition-transform">Learn more →</p>
            </Link>

            {/* BASMA Card */}
            <Link href="/basma" className="group bg-white/[0.02] border border-purple-500/20 hover:border-purple-400/50 rounded-2xl p-6 transition-all hover:bg-purple-500/5">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition mb-2">
                BASMA Music Academy
              </h3>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Music &amp; Lessons</p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Professional singing, piano, guitar &amp; vocal coaching. Gamified learning with XP. All ages welcome.
              </p>
              <ul className="space-y-1.5 text-sm text-white/40">
                <li>✓ Voice, piano, guitar, drums</li>
                <li>✓ $29 trial lesson</li>
                <li>✓ AI music mentor (Billy)</li>
              </ul>
              <p className="text-purple-400 text-sm font-semibold mt-4 group-hover:translate-x-1 transition-transform">Learn more →</p>
            </Link>

            {/* MWL Card */}
            <Link href="/mwl" className="group bg-white/[0.02] border border-yellow-500/20 hover:border-yellow-400/50 rounded-2xl p-6 transition-all hover:bg-yellow-500/5">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition mb-2">
                Major Winners League
              </h3>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Community &amp; Impact</p>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Community events, youth resources, gaming, podcasts, and motivational content in Las Vegas.
              </p>
              <ul className="space-y-1.5 text-sm text-white/40">
                <li>✓ Hopes Chance youth resources</li>
                <li>✓ Gaming &amp; community events</li>
                <li>✓ AI community bot</li>
              </ul>
              <p className="text-yellow-400 text-sm font-semibold mt-4 group-hover:translate-x-1 transition-transform">Learn more →</p>
            </Link>
          </div>
        </section>

        {/* ── About + Gateway ────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
          <ExpandableSection
            title="About BasmaWorld"
            preview="Founded by Basma Awada — singer, entrepreneur, and community leader in Las Vegas."
            icon="🌍"
            accentColor="#F59E0B"
          >
            <div className="space-y-4 text-white/60 text-sm leading-relaxed">
              <p>
                BasmaWorld is the umbrella brand of <strong className="text-white">BASMA LLC</strong>, founded by <strong className="text-white">Basma Awada</strong> in Las Vegas, Nevada. What started as a music TikTok account with 300K+ followers has grown into a full ecosystem spanning music education, social media marketing, and community impact.
              </p>
              <p>
                Our mission: <strong className="text-white">Make opportunity accessible</strong>. Whether you&apos;re a business needing marketing help, a kid wanting to learn guitar, or a young person looking for housing resources — BasmaWorld has something for you.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {[
                  { stat: '300K+', label: 'Community' },
                  { stat: '8+', label: 'Years' },
                  { stat: '100+', label: 'Students' },
                  { stat: 'Las Vegas', label: 'Home Base' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.05] rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-yellow-400">{item.stat}</p>
                    <p className="text-white/30 text-xs">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Gateway Festival 2026"
            preview="October 24 · Historic Westside School · Live music, community & culture."
            icon="🎭"
            accentColor="#EC4899"
          >
            <div className="space-y-4 text-white/60 text-sm leading-relaxed">
              <p>
                <strong className="text-white">Gateway Festival</strong> is an annual Las Vegas music and community event produced by BASMA LLC. Held at the Historic Westside School — Nevada&apos;s first school for Black children — the festival honors cultural heritage while celebrating the future.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/[0.05] rounded-xl p-4 text-center">
                  <p className="text-pink-400 font-semibold text-sm">📅 Date</p>
                  <p className="text-white/60 text-sm mt-1">October 24, 2026</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-4 text-center">
                  <p className="text-pink-400 font-semibold text-sm">📍 Venue</p>
                  <p className="text-white/60 text-sm mt-1">Historic Westside School</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-4 text-center">
                  <p className="text-pink-400 font-semibold text-sm">🎟️ Tickets</p>
                  <p className="text-white/60 text-sm mt-1">Coming soon</p>
                </div>
              </div>
              <p className="text-center pt-2">
                <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 font-semibold text-sm transition">
                  Follow @basma_singer for updates →
                </a>
              </p>
            </div>
          </ExpandableSection>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-white/40 mb-6">Pick what matters to you, and let&apos;s go.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold text-sm transition">
              💬 Contact Us
            </Link>
            <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold text-sm transition">
              🌍 All Links
            </a>
          </div>
        </section>

      </main>
    </>
  )
}
