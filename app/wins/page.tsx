export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Student Wins | BasmaWorld Music Academy Testimonials | Las Vegas',
  description: 'Real results from BasmaWorld Academy students. From beginners to performers — see what's possible in 90 days with Basma Awada.',
}

export default function WinsPage() {
  const wins = [
    {
      name: 'Maria L.',
      role: 'Las Vegas parent',
      emoji: '⭐⭐⭐⭐⭐',
      quote: 'My daughter went from never singing to performing at her school recital in just 3 months. Basma is an incredible teacher!',
      result: '3 months → School recital performance',
      color: 'border-[#8B5CF6]/30',
    },
    {
      name: 'James T.',
      role: 'Parent of 8-year-old',
      emoji: '⭐⭐⭐⭐⭐',
      quote: 'The gamified lessons kept my son engaged like nothing else. He actually ASKS to practice now!',
      result: 'From refusing to practice → daily practice',
      color: 'border-[#F59E0B]/30',
    },
    {
      name: 'Sofia R.',
      role: 'Adult beginner, age 34',
      emoji: '⭐⭐⭐⭐⭐',
      quote: "I'm an adult beginner and felt so welcome. No judgment, just pure encouragement and real results.",
      result: 'Started at 34 — singing confidently in 60 days',
      color: 'border-[#22C55E]/30',
    },
    {
      name: 'David M.',
      role: 'Las Vegas dad',
      emoji: '⭐⭐⭐⭐⭐',
      quote: 'Best music school in Las Vegas hands down. The Billy AI mentor makes it so fun for kids!',
      result: 'Enrolled 2 kids — both performing',
      color: 'border-[#EC4899]/30',
    },
    {
      name: 'Aisha K.',
      role: 'Mother of 3',
      emoji: '⭐⭐⭐⭐⭐',
      quote: "We tried 2 other music schools before BasmaWorld. Nothing compares. My kids love coming every week.",
      result: 'Switched from 2 other schools — never looked back',
      color: 'border-[#8B5CF6]/30',
    },
    {
      name: 'Marcus D.',
      role: 'Adult vocalist',
      emoji: '⭐⭐⭐⭐⭐',
      quote: "I had stage fright for years. After 12 weeks I performed at an open mic. Basma changed my life.",
      result: '12 weeks → First open mic performance',
      color: 'border-[#F59E0B]/30',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20
                          text-[#22C55E] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            ✦ Real Results · Real Students
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Student{' '}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#8B5CF6] bg-clip-text text-transparent">
              Wins
            </span>
          </h1>
          <p className="text-white/40 max-w-md mx-auto">
            From first notes to full performances. Here&apos;s what happens when you commit to 90 days.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-14">
          {[
            { stat: '100+', label: 'Students Taught' },
            { stat: '8+', label: 'Years Experience' },
            { stat: '90', label: 'Days to Performance' },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#8B5CF6]">{item.stat}</p>
              <p className="text-white/30 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {wins.map((win) => (
            <div key={win.name} className={`bg-white/[0.02] border ${win.color} rounded-2xl p-6 flex flex-col gap-4`}>
              <div className="text-sm">{win.emoji}</div>
              <p className="text-white/70 text-sm leading-relaxed italic">&ldquo;{win.quote}&rdquo;</p>
              <div className="mt-auto">
                <p className="text-white font-semibold text-sm">{win.name}</p>
                <p className="text-white/30 text-xs">{win.role}</p>
                <div className="mt-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs px-3 py-1.5 rounded-full inline-block">
                  ✓ {win.result}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your win starts with one lesson</h2>
          <p className="text-white/40 mb-6">$29 trial · No experience needed · All ages welcome</p>
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-900/30"
          >
            🎵 Book Your Trial Lesson
          </Link>
        </div>

      </section>
    </div>
  )
}
