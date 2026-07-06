'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ExpandableSection from '@/components/ExpandableSection'

/* ── Calendar helpers ── */
function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: (Date | null)[] = []
  const startDay = first.getDay()
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

const CLASS_TIMES = [
  { emoji: '👶', name: 'Tiny Tots', time: '9:00 AM', days: [1,2,3,4] },
  { emoji: '🎵', name: 'Kids Music', time: '10:00 AM', days: [1,2,3,4] },
  { emoji: '🎹', name: 'Piano', time: '12:00 PM', days: [1,2,3,4] },
  { emoji: '🎙️', name: 'Recording', time: '12:00 PM', days: [1,2,3,4] },
]

export default function HomeContent() {
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [closedDates, setClosedDates] = useState<string[]>([])
  const [calEvents, setCalEvents] = useState<{date: string; note: string; type: string}[]>([])

  // Load calendar data from API
  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => {
        setClosedDates(data.closedDates || [])
        setCalEvents(data.events || [])
      })
      .catch(() => {})
  }, [])

  const closedSet = useMemo(() => new Set(closedDates), [closedDates])
  const monthDays = useMemo(() => getMonthDays(calYear, calMonth), [calYear, calMonth])

  return (
    <>
      <main className="min-h-screen text-white" style={{ background: 'linear-gradient(160deg, #0f0225 0%, #1a053a 35%, #0d1a2e 100%)' }}>

        {/* ── Soft background glows ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
               style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
          <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
               style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
          <div className="absolute bottom-[10%] left-[25%] w-[350px] h-[350px] rounded-full blur-3xl opacity-10"
               style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        </div>

        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-semibold px-5 py-2 rounded-full mb-8 uppercase tracking-widest">
              ✨ Las Vegas · Music · Marketing · Community
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                BasmaWorld
              </span>
            </h1>

            {/* Sub */}
            <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-4">
              We help you <strong className="text-yellow-300">grow your brand</strong>,{' '}
              <strong className="text-purple-300">learn music</strong>, and{' '}
              <strong className="text-emerald-300">build community</strong> — powered by real people and AI. 🚀
            </p>

            <p className="text-white/50 text-sm mb-12">
              Founded by Basma Awada · 300K+ community · Las Vegas, NV
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/mwm"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                📱 Grow My Brand
              </Link>
              <Link
                href="/basma"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                🎵 Learn Music
              </Link>
              <Link
                href="/mwl"
                className="bg-gradient-to-r from-yellow-500 to-orange-400 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg shadow-yellow-500/25"
              >
                🏆 Join the League
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap gap-6 justify-center mt-12 text-sm text-white/50">
              <span>⭐⭐⭐⭐⭐ <span className="text-white/70">500+ students</span></span>
              <span className="text-white/20">|</span>
              <span>🎉 <span className="text-white/70">Las Vegas & Online</span></span>
              <span className="text-white/20">|</span>
              <span>🎵 <span className="text-white/70">All ages welcome</span></span>
            </div>
          </div>
        </section>

        {/* ── Hero Stage Photo ─────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-6 relative z-10">
          <div className="relative rounded-3xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/basma/basma-live-music-stage.jpg"
              alt="Basma singing live on stage with Live Music neon sign"
              className="w-full object-cover max-h-[460px] object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between">
              <div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">🎤 Live in Las Vegas</p>
                <p className="text-white text-2xl font-black leading-tight">Basma Awada — Live on Stage</p>
                <p className="text-white/65 text-sm mt-1">Singer · Songwriter · Vocal Coach · Founder</p>
              </div>
              <a
                href="/basma"
                className="shrink-0 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-3 rounded-2xl text-sm transition-all hover:scale-105 hidden sm:block"
              >
                🎵 Learn with Basma →
              </a>
            </div>
          </div>
        </section>

        {/* ── What We Offer ── */}
        <section className="max-w-5xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              What Can We Do For You? 🤔
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Three brands. One mission. Whether you need marketing, music education, or community — we&apos;ve got you covered!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* MWM Card */}
            <Link
              href="/mwm"
              className="group bg-gradient-to-b from-blue-900/40 to-cyan-950/20 border border-blue-500/30 hover:border-blue-400/60 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition mb-2">
                Major Winners Marketing
              </h3>
              <p className="text-blue-300/70 text-xs uppercase tracking-widest mb-3 font-semibold">Social Media Services</p>
              <p className="text-white/65 text-sm leading-relaxed mb-4">
                We grow your social media, create content, and build your brand presence. Real results. AI-assisted.
              </p>
              <ul className="space-y-1.5 text-sm text-white/55">
                <li>✅ Social media management</li>
                <li>✅ Content creation & strategy</li>
                <li>✅ AI-powered marketing bot</li>
              </ul>
              <p className="text-blue-400 text-sm font-bold mt-5 group-hover:translate-x-1 transition-transform">
                Let&apos;s grow! →
              </p>
            </Link>

            {/* BASMA Card */}
            <Link
              href="/basma"
              className="group bg-gradient-to-b from-purple-900/40 to-pink-950/20 border border-purple-500/30 hover:border-purple-400/60 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition mb-2">
                BASMA Music Academy
              </h3>
              <p className="text-purple-300/70 text-xs uppercase tracking-widest mb-3 font-semibold">Music & Lessons</p>
              <p className="text-white/65 text-sm leading-relaxed mb-4">
                Professional singing, piano, guitar & vocal coaching. Gamified learning with XP. All ages welcome!
              </p>
              <ul className="space-y-1.5 text-sm text-white/55">
                <li>✅ Voice, piano, guitar, drums</li>
                <li>✅ Summer camp from $25/day</li>
                <li>✅ AI music mentor (Billy)</li>
              </ul>
              <p className="text-purple-400 text-sm font-bold mt-5 group-hover:translate-x-1 transition-transform">
                Start learning! →
              </p>
            </Link>

            {/* MWL Card */}
            <Link
              href="/mwl"
              className="group bg-gradient-to-b from-yellow-900/40 to-orange-950/20 border border-yellow-500/30 hover:border-yellow-400/60 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition mb-2">
                Major Winners League
              </h3>
              <p className="text-yellow-300/70 text-xs uppercase tracking-widest mb-3 font-semibold">Community & Impact</p>
              <p className="text-white/65 text-sm leading-relaxed mb-4">
                Community events, youth resources, gaming, podcasts, and motivational content in Las Vegas!
              </p>
              <ul className="space-y-1.5 text-sm text-white/55">
                <li>✅ Hopes Chance youth resources</li>
                <li>✅ Gaming & community events</li>
                <li>✅ AI community bot</li>
              </ul>
              <p className="text-yellow-400 text-sm font-bold mt-5 group-hover:translate-x-1 transition-transform">
                Join the league! →
              </p>
            </Link>
          </div>
        </section>

        {/* ── About + Gateway ── */}
        <section className="max-w-4xl mx-auto px-4 pb-20 space-y-4 relative z-10">
          <ExpandableSection
            title="About BasmaWorld 🌍"
            preview="Founded by Basma Awada — singer, entrepreneur, and community leader in Las Vegas."
            icon="🌍"
            accentColor="#F59E0B"
          >
            <div className="space-y-4 text-white/70 text-sm leading-relaxed">
              <p>
                BasmaWorld is the umbrella brand of <strong className="text-white">BASMA LLC</strong>, founded by <strong className="text-white">Basma Awada</strong> in Las Vegas, Nevada. What started as a music TikTok account with 300K+ followers has grown into a full ecosystem spanning music education, social media marketing, and community impact.
              </p>
              <p>
                Our mission: <strong className="text-yellow-300">Make opportunity accessible</strong>. Whether you&apos;re a business needing marketing help, a kid wanting to learn guitar, or a young person looking for housing resources — BasmaWorld has something for you. 💜
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                {[
                  { stat: '300K+', label: 'Community' },
                  { stat: '8+', label: 'Years' },
                  { stat: '100+', label: 'Students' },
                  { stat: 'Las Vegas', label: 'Home Base' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-xl font-black text-yellow-400">{item.stat}</p>
                    <p className="text-white/60 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title="Gateway Festival 2026 🎭"
            preview="October 24 · Historic Westside School · Live music, community & culture."
            icon="🎭"
            accentColor="#EC4899"
          >
            <div className="space-y-4 text-white/70 text-sm leading-relaxed">
              <p>
                <strong className="text-white">Gateway Festival</strong> is an annual Las Vegas music and community event produced by BASMA LLC. Held at the Historic Westside School — Nevada&apos;s first school for Black children — the festival honors cultural heritage while celebrating the future. 🎉
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-pink-900/30 border border-pink-500/20 rounded-2xl p-4 text-center">
                  <p className="text-pink-400 font-bold text-sm">📅 Date</p>
                  <p className="text-white/70 text-sm mt-1">October 24, 2026</p>
                </div>
                <div className="bg-pink-900/30 border border-pink-500/20 rounded-2xl p-4 text-center">
                  <p className="text-pink-400 font-bold text-sm">📍 Venue</p>
                  <p className="text-white/70 text-sm mt-1">Historic Westside School</p>
                </div>
                <div className="bg-pink-900/30 border border-pink-500/20 rounded-2xl p-4 text-center">
                  <p className="text-pink-400 font-bold text-sm">🎟️ Tickets</p>
                  <p className="text-white/70 text-sm mt-1">Coming soon!</p>
                </div>
              </div>
              <p className="text-center pt-2">
                <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                   className="text-pink-400 hover:text-pink-300 font-bold text-sm transition">
                  Follow @basma_singer for updates →
                </a>
              </p>
            </div>
          </ExpandableSection>
        </section>

        {/* ── Business Calendar ──────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-4 pb-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              📅 Are We Open Today?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm">
              Check our live calendar — classes run Monday through Thursday. Tap any day to see what&apos;s happening!
            </p>
          </div>

          <div className="rounded-3xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Month nav */}
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white/50 hover:bg-white/10 transition">‹</button>
              <h3 className="text-xl font-bold" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white/50 hover:bg-white/10 transition">›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-white/30 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="min-h-[60px]" />
                const today = new Date()
                const isToday = day.toDateString() === today.toDateString()
                const dateStr = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`
                const isClosed = closedSet.has(dateStr)
                const dow = day.getDay()
                const hasClasses = dow >= 1 && dow <= 4 && !isClosed
                const closureEvent = calEvents.find(e => e.date === dateStr)

                return (
                  <div key={i} className={`min-h-[60px] rounded-lg p-1.5 text-center transition ${isToday ? 'ring-2 ring-yellow-400/50' : ''}`}
                    style={{ background: isClosed ? 'rgba(239,68,68,0.08)' : hasClasses ? 'rgba(34,197,94,0.04)' : 'transparent' }}
                    title={isClosed ? (closureEvent?.note || 'Closed') : hasClasses ? 'Classes today!' : 'No classes'}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-yellow-400 font-bold' : isClosed ? 'text-red-400' : hasClasses ? 'text-white' : 'text-white/20'}`}>
                      {day.getDate()}
                    </span>
                    {isClosed && <div className="text-[8px] text-red-400 mt-0.5">Closed</div>}
                    {hasClasses && !isClosed && (
                      <div className="flex justify-center gap-0.5 mt-0.5">
                        {CLASS_TIMES.filter(c => c.days.includes(dow)).slice(0, 3).map((c, ci) => (
                          <span key={ci} className="text-[7px]">{c.emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center mt-6 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500/60" /> Classes</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500/60" /> Closed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400/60" /> Today</span>
            </div>

            {/* Upcoming closures banner */}
            {calEvents.filter(e => {
              const d = new Date(e.date + 'T00:00:00')
              return d >= new Date() && (e.type === 'closure' || e.type === 'holiday' || e.type === 'break')
            }).slice(0, 3).length > 0 && (
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <h4 className="text-sm font-semibold text-red-400 mb-2">🚫 Upcoming Closures</h4>
                {calEvents.filter(e => {
                  const d = new Date(e.date + 'T00:00:00')
                  return d >= new Date() && (e.type === 'closure' || e.type === 'holiday' || e.type === 'break')
                }).slice(0, 3).map((e, i) => (
                  <div key={i} className="text-xs text-white/40 py-0.5">
                    <span className="text-red-400/70 font-mono">{e.date}</span> — {e.note}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA under calendar */}
          <div className="text-center mt-6">
            <Link href="/schedule" className="text-sm font-semibold transition hover:opacity-80" style={{ color: '#c9a84c' }}>
              View Full Schedule & Pricing →
            </Link>
          </div>
        </section>

        {/* ── Billy + Basma Photo Teaser ───────────────────── */}
        <section className="max-w-5xl mx-auto px-4 pb-8 relative z-10">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { src: '/images/billy/billy-closeup-smile.jpg', label: 'Meet Billy! 🧡' },
              { src: '/images/basma/basma-performing-stage-2.jpg', label: 'Live in Las Vegas 🎤' },
              { src: '/images/studio/studio-setup-3.jpg', label: 'The Studio 🎸' },
              { src: '/images/billy/basma-with-billy.jpg', label: 'Basma & Billy 💜' },
              { src: '/images/basma/basma-orchestra.jpg', label: 'Full Orchestra 🎼' },
              { src: '/images/basma/basma-teaching-classroom.jpg', label: 'In the classroom 📚' },
            ].map((item) => (
              <div key={item.src} className="relative rounded-2xl overflow-hidden group aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <span className="text-white text-xs font-bold">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center relative z-10">
          <div
            className="rounded-3xl p-10"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(251,191,36,0.15))', border: '1px solid rgba(168,85,247,0.3)' }}
          >
            <h2 className="text-3xl font-black text-white mb-3">Ready to get started? 🎉</h2>
            <p className="text-white/60 mb-8 text-lg">Pick what matters to you, and let&apos;s go. We&apos;re rooting for you! 💜</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="bg-white/15 hover:bg-white/25 border border-white/25 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              >
                💬 Contact Us
              </Link>
              <a
                href="/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              >
                🌍 All Links
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
