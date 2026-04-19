export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'
import BillyChat from '@/components/BillyChat'
import BillyChatButton from '@/components/BillyChatButton'

export const metadata: Metadata = {
  title: 'BasmaTeach Me | Billy the Puppet — Kids Music Education on TikTok',
  description: 'Meet Billy the Puppet! Funny, sassy, kid-friendly music education on TikTok @basmateachme. Learn instruments, music theory, and more with Billy and Basma.',
  keywords: 'Billy the Puppet, BasmaTeach Me, kids music lessons, TikTok music education, learn to sing kids, basmateachme tiktok, music education for children',
  openGraph: {
    title: 'BasmaTeach Me | Billy the Puppet — Kids Music on TikTok',
    description: 'Billy the Puppet teaches kids music on TikTok! Funny, sassy, kid-friendly. @basmateachme.',
    url: 'https://basmaworld.com/mwl/basmateachme',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-mwl.jpg', width: 1200, height: 630, alt: 'BasmaTeach Me — Billy the Puppet kids music education on TikTok' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basmateachme',
    creator: '@basma_singer',
    title: 'BasmaTeach Me — Billy the Puppet',
    description: 'Kids music education on TikTok with Billy the Puppet!',
    images: ['/images/basma-mwl.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwl/basmateachme',
  },
}

export default function BasmaTeachMePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="text-7xl mb-6 animate-bounce">🪆</div>
        <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          ✦ Kids Music Education
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Meet{' '}
          <span className="bg-gradient-to-r from-[#22C55E] to-[#F59E0B] bg-clip-text text-transparent">
            Billy
          </span>
          {' '}the Puppet
        </h1>
        <p className="text-white/50 text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          Funny. Sassy. Surprisingly educational. Billy makes learning music the most fun thing you&apos;ll do all day.
        </p>
        <a
          href="https://www.tiktok.com/@basmateachme"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-green-900/30"
        >
          🎵 Follow @basmateachme on TikTok
        </a>
      </section>

      {/* Billy's Personality */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Who is Billy? 🤔</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: '😂', title: 'Hilarious', desc: "Billy's jokes are terrible. Kids love them anyway. Parents groan. Everyone learns." },
            { emoji: '🎓', title: 'Educational', desc: 'Sneaks in real music theory, instrument techniques, and practice tips without anyone noticing.' },
            { emoji: '💚', title: 'Kid-Friendly', desc: 'Ages 5-14 love Billy. Safe, positive, encouraging. Never mean — just playfully sassy.' },
          ].map((item) => (
            <div key={item.title} className="bg-white/[0.03] border border-[#22C55E]/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Billy Teaches */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#F59E0B]/10 border border-[#22C55E]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What You&apos;ll Learn 🎵</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              '🎤 Singing & Vocals',
              '🎹 Piano Basics',
              '🎸 Guitar Tips',
              '🥁 Drum Rhythms',
              '🎻 Violin & Strings',
              '🎼 Music Theory',
              '🎧 Ear Training',
              '⭐ Stage Presence',
              '🎵 Fun Music Facts',
            ].map((item) => (
              <div key={item} className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <div className="bg-black border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-3">Watch Billy on TikTok 📱</h2>
          <p className="text-white/40 mb-6">New episodes weekly. Follow so you never miss a lesson — or a terrible joke.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.tiktok.com/@basmateachme"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Follow @basmateachme
            </a>
            <Link
              href="/academy"
              className="border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-[#8B5CF6] hover:text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Book Real Lessons →
            </Link>
          </div>
        </div>
      </section>

      {/* Billy Chat */}
      <BillyChat page="basmateachme" />
      <BillyChatButton />
    </div>
  )
}
