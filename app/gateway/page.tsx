export const dynamic = 'force-static'
export const revalidate = 3600

import type { Metadata } from 'next'
import Link from 'next/link'
import FestivalCountdown from '@/components/FestivalCountdown'

export const metadata: Metadata = {
  title: 'Gateway Festival 2026 — October 24 | Historic Westside School Las Vegas',
  description: 'Gateway Festival — October 24, 2026 at the Historic Westside School in Las Vegas. Live music, community, and culture. Produced by Basma Awada / BasmaWorld.',
  keywords: ['gateway festival las vegas', 'gateway festival 2026', 'las vegas music festival', 'historic westside school event', 'basma awada festival', 'las vegas community events', 'live music las vegas'],
  openGraph: {
    title: 'Gateway Festival 2026 — October 24, Las Vegas',
    description: 'October 24, 2026 · Historic Westside School · Live music, community & culture.',
    url: 'https://basmaworld.com/gateway',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-community.jpg', width: 1200, height: 630, alt: 'Gateway Festival 2026 — live music event at Historic Westside School Las Vegas' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Gateway Festival 2026 — Las Vegas',
    description: 'October 24 · Historic Westside School · Live music & community.',
    images: ['/images/basma-community.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/gateway',
  },
}

export default function GatewayFestivalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20
                        text-[#F59E0B] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          🎭 Las Vegas · October 24, 2026
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Gateway{' '}
          <span className="bg-gradient-to-r from-[#F59E0B] to-[#EC4899] bg-clip-text text-transparent">
            Festival
          </span>
        </h1>
        <p className="text-white/50 text-xl max-w-xl mx-auto mb-4 leading-relaxed">
          A celebration of music, community, and Las Vegas culture — produced by Basma Awada at the Historic Westside School.
        </p>
        <p className="text-white/30 text-sm mb-10">
          📍 Historic Westside School · Las Vegas, NV · October 24, 2026
        </p>

        {/* Live Countdown */}
        <div className="mb-10">
          <FestivalCountdown />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://www.tiktok.com/@basma_singer"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-black px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-yellow-900/30"
          >
            🎵 Follow for Updates
          </a>
          <Link
            href="/academy"
            className="border border-white/20 hover:border-white/40 text-white/60 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            Perform at the Festival →
          </Link>
        </div>
      </section>

      {/* About section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">About the Festival 🎭</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Gateway Festival is an annual Las Vegas music and community event produced by BASMA LLC. Held at the Historic Westside School — Nevada&apos;s first school for Black children — the festival honors cultural heritage while celebrating the future of Las Vegas music.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">Student Performers 🎤</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              BasmaWorld Academy students are invited to perform at the festival as their 90-day program showcase. The festival stage is the finish line of the Creator Loop curriculum.
            </p>
            <Link href="/academy" className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm font-medium transition">
              Join the Academy to perform →
            </Link>
          </div>
        </div>
      </section>

      {/* Event details */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#EC4899]/10 border border-[#F59E0B]/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-[#F59E0B] font-semibold mb-1">📅 Date</p>
              <p className="text-white/60">Saturday, October 24, 2026</p>
            </div>
            <div>
              <p className="text-[#F59E0B] font-semibold mb-1">📍 Venue</p>
              <p className="text-white/60">Historic Westside School<br/>Las Vegas, NV</p>
            </div>
            <div>
              <p className="text-[#F59E0B] font-semibold mb-1">🎟️ Tickets</p>
              <p className="text-white/60">Coming soon — follow<br/>@basma_singer for updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
