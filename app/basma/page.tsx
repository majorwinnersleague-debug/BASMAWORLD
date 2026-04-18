export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basma Awada | Singer, Vocal Coach & Music Educator | Las Vegas',
  description: 'Basma Awada — Las Vegas singer, vocal coach, and music educator. 270K+ TikTok followers. Founder of BasmaWorld and Become A Singer Music Academy.',
}

export default function BasmaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="text-6xl mb-6">🎤</div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Basma
          </span>
        </h1>
        <p className="text-white/50 text-xl max-w-xl mx-auto mb-10">
          Singer. Vocal Coach. Educator. Creator. Las Vegas.
        </p>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { href: '/basma/artist', emoji: '🎭', title: 'Artist', desc: 'Music, upcoming album Masqued, artist journey', color: 'border-[#EC4899]/30 hover:border-[#EC4899]/60' },
            { href: '/basma/lessons', emoji: '🎵', title: 'Lessons', desc: 'Private lessons — voice, piano, guitar & more', color: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60' },
            { href: '/academy', emoji: '🏫', title: 'Academy', desc: 'Become A Singer Music Academy — book $29 trial', color: 'border-[#F59E0B]/30 hover:border-[#F59E0B]/60' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`bg-white/[0.03] border ${item.color} rounded-2xl p-6 text-center transition hover:bg-white/[0.05] group`}>
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-[#8B5CF6] transition">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full transition">
            🎵 @basma_singer · 270K+
          </a>
          <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full transition">
            🪆 @basmateachme
          </a>
          <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full transition">
            📸 @basma.tea
          </a>
        </div>
      </section>
    </div>
  )
}
