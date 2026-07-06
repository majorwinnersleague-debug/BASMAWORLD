'use client'

import Link from 'next/link'

const CLASSES = [
  { emoji: '👶', name: 'Tiny Tots Music & Movement', age: 'Ages 5 & Under', time: '9:00 – 9:45 AM', duration: '45 min', desc: 'An engaging introduction to music through singing, movement, rhythm, storytelling, instruments, and creative play.' },
  { emoji: '🎵', name: 'Kids Music Academy', age: 'By Skill Level', time: '10:00 – 11:15 AM', duration: '1h 15min', desc: 'Students build musical skills through singing, rhythm, movement, music theory, and instrument exploration while learning songs based on the monthly theme.' },
  { emoji: '🎵', name: 'Kids Music Academy', age: 'By Skill Level', time: '11:30 AM – 12:45 PM', duration: '1h 15min', desc: 'Same curriculum as the morning session with multiple scheduling options for families.' },
  { emoji: '🎸', name: 'Band Academy', age: 'By Skill Level', time: '1:00 – 2:15 PM', duration: '1h 15min', desc: 'Students develop ensemble skills on their instrument of choice — piano, guitar, drums, violin, voice, ukulele, bass, and more. Every student also learns piano fundamentals.' },
  { emoji: '🎹', name: 'Piano Fundamentals', age: 'By Skill Level', time: '45 Minutes', duration: '45 min', desc: 'Focused piano instruction covering note reading, technique, rhythm, ear training, and performance skills. Individual and small-group instruction available.' },
]

export default function BasmaContent() {
  return (
    <main className="min-h-screen text-white pt-16">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          BASMA <span className="gradient-gold">Academy</span>
        </h1>
        <p className="text-white/40 text-base mb-2">Mon – Thu · 9:00 AM – 2:15 PM · All ages</p>
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
                <div className="text-white/30 text-xs">{cls.time} · {cls.duration}</div>
                <div className="text-white/20 text-xs mt-1">{cls.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-white/30">
          <span>🎵 Monthly themes for all classes</span>
          <span>📊 Weekly progress reports</span>
          <span>🎓 Scholarship available</span>
        </div>
      </section>

      {/* ── Scholarship ── */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <a href="/scholarship">
          <div className="rounded-xl p-6 text-center cursor-pointer transition hover:scale-[1.01]" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              🎓 BASMA World Scholarship
            </h3>
            <p className="text-white/40 text-sm mb-4">
              $250/month — 1 hour of daily classes for your entire family · Limited spots
            </p>
            <span
              className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
            >
              Learn More →
            </span>
          </div>
        </a>
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
