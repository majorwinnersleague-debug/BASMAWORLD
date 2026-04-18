export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Basma Awada — Las Vegas Singer, Vocal Coach & Artist | BasmaWorld',
  description: 'Basma Awada is a Las Vegas-based singer, songwriter, and vocal coach with 270K+ TikTok followers. Founder of BasmaWorld and Become A Singer Music Academy.',
}

export default function ArtistPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          ✦ Las Vegas Artist
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Basma{' '}
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Awada
          </span>
        </h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
          Singer. Songwriter. Vocal Coach. Founder. Las Vegas native building a world where music education meets community.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <a
            href="https://www.tiktok.com/@basma_singer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black border border-white/20 hover:border-white/40 text-white px-5 py-2.5 rounded-xl font-medium transition text-sm"
          >
            🎵 @basma_singer · 270K+
          </a>
          <a
            href="https://www.instagram.com/basma.tea"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-[#833ab4]/20 to-[#fd1d1d]/20 border border-[#833ab4]/30 hover:border-[#833ab4]/60 text-white px-5 py-2.5 rounded-xl font-medium transition text-sm"
          >
            📸 @basma.tea
          </a>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-6">About Basma</h2>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              Basma Awada is a Las Vegas-based singer, songwriter, and vocal coach who has spent 8+ years transforming the way people experience music education. With over <strong className="text-white">270,000 TikTok followers</strong>, she has built one of the most engaged music education communities online — proving that learning can be entertaining, accessible, and deeply human.
            </p>
            <p>
              As the founder of <strong className="text-white">BasmaWorld</strong> and <strong className="text-white">Become A Singer Music Academy</strong>, Basma has created a gamified learning ecosystem where students earn XP, unlock skills, and work toward real performances. Her students range from 5-year-olds picking up their first instrument to adults who always believed it was &quot;too late&quot; to sing.
            </p>
            <p>
              As an artist, Basma draws from jazz, commercial pop, and theatrical influences — a sound shaped by Las Vegas itself. Her upcoming album <strong className="text-[#EC4899]">Masqued</strong> explores identity, performance, and the courage it takes to remove the masks we wear for the world.
            </p>
          </div>
        </div>
      </section>

      {/* Masqued Album Teaser */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="relative bg-gradient-to-br from-[#EC4899]/10 to-[#8B5CF6]/10 border border-[#EC4899]/20 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-4xl mb-4">🎭</div>
            <div className="inline-flex items-center gap-2 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Coming Soon
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] bg-clip-text text-transparent">
                Masqued
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-6 leading-relaxed">
              A cinematic album about identity, performance, and the courage to be truly seen. Theatrical jazz meets modern pop — a sonic unmasking.
            </p>
            <a
              href="https://www.tiktok.com/@basma_singer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
            >
              Follow for Updates →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stat: '270K+', label: 'TikTok Followers' },
            { stat: '8+', label: 'Years Teaching' },
            { stat: '100+', label: 'Students Taught' },
            { stat: 'Las Vegas', label: 'Home Base' },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-[#8B5CF6]">{item.stat}</p>
              <p className="text-white/40 text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Learn from Basma directly</h2>
        <p className="text-white/40 mb-6">Book a $29 trial lesson at Become A Singer Music Academy</p>
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-900/30"
        >
          🎵 Book Trial Lesson — $29
        </Link>
      </section>

    </div>
  )
}
