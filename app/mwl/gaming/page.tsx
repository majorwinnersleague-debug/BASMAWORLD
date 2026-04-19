import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'

export const metadata: Metadata = {
  title: 'Gaming | Major Winners League',
  description: 'Gaming content for youth under Major Winners League. Follow Basma on TikTok @basma_singer — 270k+ followers — for gaming streams, tips, and community challenges.',
  keywords: 'MWL gaming, gaming youth Las Vegas, basma singer TikTok gaming, Major Winners League gaming, esports youth Nevada',
  openGraph: {
    title: 'Gaming | Major Winners League',
    description: 'Gaming content for youth from Major Winners League. Follow @basma_singer on TikTok for streams, tips, and community challenges.',
    url: 'https://basmaworld.com/mwl/gaming',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-mwl.jpg', width: 1200, height: 630, alt: 'Major Winners League Gaming — youth gaming community in Las Vegas' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Gaming | Major Winners League',
    description: 'Youth gaming content, streams & community challenges.',
    images: ['/images/basma-mwl.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwl/gaming',
  },
}

const gamingContent = [
  {
    emoji: '🎮',
    title: 'Gaming Streams',
    desc: 'Live gaming sessions, commentary, and reactions. Real gameplay, real energy, zero editing tricks.',
  },
  {
    emoji: '🏆',
    title: 'Community Challenges',
    desc: 'Weekly challenges where MWL youth compete, collaborate, and claim bragging rights.',
  },
  {
    emoji: '📱',
    title: 'Mobile Gaming',
    desc: 'Not just console — mobile gaming content that meets youth where they actually play.',
  },
  {
    emoji: '🧠',
    title: 'Game Skills = Life Skills',
    desc: 'Strategy, teamwork, resilience under pressure — gaming builds real-world winners. MWL knows it.',
  },
  {
    emoji: '🎯',
    title: 'Tips & Tutorials',
    desc: 'Level up your skills. Pro-tips, game guides, and beginner-friendly walkthroughs.',
  },
  {
    emoji: '🌐',
    title: 'Gaming Community',
    desc: 'A positive, inclusive space for youth gamers to connect, compete, and grow together.',
  },
]

export default function Gaming() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span>/</span>
            <span style={{ color: '#BF5FFF' }}>Gaming</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="text-7xl mb-4">🎮</div>
            <p
              className="font-bold uppercase tracking-widest text-sm mb-3"
              style={{ color: '#BF5FFF' }}
            >
              Major Winners League · Youth Gaming
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ color: '#BF5FFF' }}
            >
              Gaming
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Real gaming. Real community. Real winners. MWL brings the culture of gaming together with
              purpose, connection, and next-level energy for youth.
            </p>
          </div>

          {/* Stats Banner */}
          <div
            className="rounded-2xl p-6 mb-14 border"
            style={{
              background: 'rgba(191,95,255,0.08)',
              borderColor: 'rgba(191,95,255,0.35)',
            }}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#BF5FFF' }}
                >
                  270K+
                </p>
                <p className="text-gray-400 text-sm">TikTok Followers</p>
              </div>
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#BF5FFF' }}
                >
                  LV
                </p>
                <p className="text-gray-400 text-sm">Las Vegas, NV</p>
              </div>
              <div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: '#BF5FFF' }}
                >
                  MWL
                </p>
                <p className="text-gray-400 text-sm">Major Winners League</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <h2 className="text-3xl font-bold text-white mb-6">What We Drop</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {gamingContent.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border transition hover:scale-[1.02]"
                style={{
                  background: 'rgba(191,95,255,0.05)',
                  borderColor: 'rgba(191,95,255,0.2)',
                }}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: '#BF5FFF' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* TikTok CTA */}
          <div
            className="rounded-2xl p-8 mb-14 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(191,95,255,0.15) 0%, rgba(0,0,0,0.9) 100%)',
              borderColor: 'rgba(191,95,255,0.45)',
            }}
          >
            <div className="text-5xl mb-4">📱</div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: '#BF5FFF' }}
            >
              Follow the Action on TikTok
            </h2>
            <p className="text-gray-400 mb-3">
              <span
                className="font-bold text-lg"
                style={{ color: '#BF5FFF' }}
              >
                @basma_singer
              </span>{' '}
              has 270k+ followers and counting. Gaming streams, community content, and major energy — all live on TikTok.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Join the community. Watch the streams. Be part of the movement.
            </p>
            <a
              href="https://www.tiktok.com/@basma_singer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-white transition hover:brightness-110 hover:scale-105"
              style={{ background: '#BF5FFF' }}
            >
              <span className="text-xl">🎮</span>
              Follow @basma_singer on TikTok
            </a>
          </div>

          {/* MWL Gaming Vision */}
          <div
            className="rounded-2xl p-8 mb-8 border"
            style={{
              background: 'rgba(191,95,255,0.06)',
              borderColor: 'rgba(191,95,255,0.2)',
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">🏆 Gaming Is for Major Winners</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              At MWL, we believe gaming is more than entertainment — it&apos;s a culture, a community, and a career path.
              We celebrate youth who excel in the gaming world and create spaces where they can connect with others who
              share the passion.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Whether you&apos;re a casual player, a competitive gamer, or a content creator — Major Winners League
              welcomes you. You&apos;re already winning by showing up.
            </p>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link
              href="/mwl"
              className="border font-semibold px-6 py-3 rounded-full transition hover:border-purple-400 inline-block"
              style={{ borderColor: 'rgba(191,95,255,0.5)', color: '#BF5FFF' }}
            >
              ← Back to MWL
            </Link>
          </div>

        </div>
      </main>
      <Footer />
      <BillyChat page="general" />
    </>
  )
}
