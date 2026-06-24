'use client'

import Link from 'next/link'

const CLASSES = [
  { emoji: '👶', name: 'Tiny Tots', age: '5 & Under', time: '9:00 – 9:45 AM', july: 25, august: 25, desc: 'Explore instruments, sounds, and learn about music in general.' },
  { emoji: '🎵', name: 'Kids Music', age: '5–10', time: '10:00 – 11:30 AM', july: 25, august: 30, desc: 'Learn instruments, songs as a group, techniques on being a musician, and have fun!' },
  { emoji: '🎤', name: 'Kids Music', age: '10–17', time: '11:30 AM – 1:00 PM', july: 25, august: 30, desc: 'Learn instruments, songs as a group, techniques on being a musician, and have fun!' },
  { emoji: '🎹', name: 'Piano', age: 'All Ages', time: '1:30 – 2:45 PM', july: 25, august: 35, desc: 'Train to play your favorite songs on piano, music theory, and prepare for music in school.' },
  { emoji: '🎙️', name: 'Recording', age: 'All Ages', time: '2:45 – 4:00 PM', july: 25, august: 40, desc: 'Learn to record yourself at home and build your artist image.' },
]

export default function BasmaContent() {
  return (
    <main className="min-h-screen text-white pt-16">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          BASMA <span className="gradient-gold">Summer Camp</span>
        </h1>
        <p className="text-white/40 text-base mb-2">Mon – Thu · Starting June 29 · All ages</p>
        <p className="text-white/30 text-sm mb-8">📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas</p>
        <Link
          href="/enroll"
          className="inline-block px-10 py-4 rounded-full font-bold text-base transition hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
        >
          Enroll Now
        </Link>
      </section>

      {/* ── Classes ── */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Classes
        </h2>
        <div className="space-y-3">
          {CLASSES.map(cls => (
            <div key={`${cls.name}-${cls.age}`} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-2xl">{cls.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{cls.name} <span className="text-white/30 text-xs font-normal">({cls.age})</span></div>
                <div className="text-white/30 text-xs">{cls.time}</div>
                <div className="text-white/20 text-xs mt-1">{cls.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-lg" style={{ color: '#c9a84c' }}>${cls.july}</div>
                <div className="text-white/25 text-[10px]">July/day</div>
                {cls.august !== cls.july && (
                  <div className="text-white/30 text-xs mt-0.5">${cls.august} Aug</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-white/30">
          <span>🟢 15% off weekly</span>
          <span>🟢 25% off monthly</span>
          <span>🟡 $5 off each additional child</span>
        </div>
      </section>

      {/* ── Free Private Lesson ── */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
          <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Free 20-Min Private Lesson
          </h3>
          <p className="text-white/40 text-sm mb-4">
            By appointment only · Before 9 AM or after 4 PM
          </p>
          <a
            href="tel:+17027887369"
            className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
          >
            📞 Call (702) 788-7369
          </a>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-white/25 text-sm">Studio: 6787 W Tropicana Ave Suite 260, Las Vegas NV 89103</p>
        <p className="text-white/25 text-sm">Camp: 9512 W Flamingo Rd STE 100, Las Vegas NV 89147</p>
        <p className="text-white/25 text-sm mt-1">(702) 788-7369</p>
      </section>

    </main>
  )
}
