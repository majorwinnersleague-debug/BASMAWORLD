'use client'

import Link from 'next/link'

const LESSONS = [
  { emoji: '🎤', name: '30-Minute Individual Lesson', desc: 'One-on-one instruction tailored to your goals, level, and musical interests.', price: '$45' },
  { emoji: '🎹', name: '60-Minute Individual Lesson', desc: 'More time for technique, repertoire, and focused musical development.', price: '$70' },
  { emoji: '🎵', name: '4 × 30-Minute Monthly Package', desc: 'Four private 30-minute lessons paid in advance each month.', price: '$135/month' },
  { emoji: '🎶', name: '4 × 60-Minute Monthly Package', desc: 'Four private 60-minute lessons paid in advance each month.', price: '$200/month' },
]

export default function BasmaContent() {
  return (
    <main className="min-h-screen text-white" style={{ paddingTop: 'calc(var(--ann-bar-height, 0px) + 64px)' }}>
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          BASMA <span className="gradient-gold">Private Lessons</span>
        </h1>
        <p className="text-white/40 text-base mb-2">One-on-one music instruction · All ages</p>
        <p className="text-white/30 text-sm mb-8">📍 6787 W Tropicana Ave Suite 260, Las Vegas</p>
        <Link
          href="/private-lessons"
          className="inline-block px-10 py-4 rounded-full font-bold text-base transition hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
        >
          View Private Lessons
        </Link>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-lg font-bold text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Private Lesson Options
        </h2>
        <div className="space-y-3">
          {LESSONS.map(lesson => (
            <div key={lesson.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-2xl">{lesson.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{lesson.name}</div>
                <div className="text-white/30 text-xs mt-1">{lesson.desc}</div>
              </div>
              <span className="text-[#c9a84c] font-bold text-sm whitespace-nowrap">{lesson.price}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-white/30">
          <span>🎵 Personalized instruction</span>
          <span>📋 1 makeup lesson with monthly packages</span>
          <span>🌎 Online options available</span>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-white/25 text-sm">Studio: 6787 W Tropicana Ave Suite 260, Las Vegas NV 89103</p>
        <p className="text-white/25 text-sm mt-1">(702) 788-7369</p>
      </section>
    </main>
  )
}
