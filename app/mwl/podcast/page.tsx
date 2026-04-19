export const dynamic = 'force-static'
export const revalidate = 86400

import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mildly Interesting Podcast | Major Winners League | BasmaWorld',
  description: 'The Mildly Interesting podcast with Wesley — real conversations about community, creativity, and winning at life. From Las Vegas, Nevada.',
  keywords: 'Mildly Interesting podcast, Wesley podcast, Las Vegas podcast, community podcast Nevada, motivational speaker Las Vegas, nonprofit interviews Nevada',
  openGraph: {
    title: 'Mildly Interesting Podcast | MWL',
    description: 'Real conversations about community, creativity, and what it means to win in life.',
    url: 'https://basmaworld.com/mwl/podcast',
    siteName: 'BasmaWorld',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/basma-community.jpg', width: 1200, height: 630, alt: 'Mildly Interesting Podcast — real conversations from Major Winners League' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@basma_singer',
    creator: '@basma_singer',
    title: 'Mildly Interesting Podcast | MWL',
    description: 'Real conversations about community, creativity & winning in life.',
    images: ['/images/basma-community.jpg'],
  },
  alternates: {
    canonical: 'https://basmaworld.com/mwl/podcast',
  },
}

const episodes = [
  {
    number: 'E01',
    title: 'What Does It Mean to Win?',
    guest: 'Wesley & Basma',
    desc: 'The debut episode. We define what winning really means — beyond money, beyond trophies. A conversation about purpose, community, and showing up.',
    duration: '42 min',
    tags: ['Mindset', 'Community']
  },
  {
    number: 'E02',
    title: 'Mildly Interesting Things About Las Vegas',
    guest: 'Wesley & Basma',
    desc: 'Beyond the strip. The real Las Vegas — its communities, its struggles, its hidden champions doing incredible work every day.',
    duration: '38 min',
    tags: ['Las Vegas', 'Culture']
  },
  {
    number: 'E03',
    title: 'The Art of Showing Up',
    guest: 'Wesley & Basma',
    desc: 'Consistency over intensity. How to keep going when motivation fades and discipline has not kicked in yet.',
    duration: '45 min',
    tags: ['Resilience', 'Growth']
  },
]

export default function Podcast() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span>/</span>
            <span className="text-yellow-400">Podcast</span>
          </div>

          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127897;</div>
            <h1 className="text-5xl font-bold text-yellow-400 mb-3">Mildly Interesting</h1>
            <p className="text-xl text-gray-300 mb-2">with Wesley &amp; Basma</p>
            <p className="text-gray-500 max-w-2xl mx-auto">Real, unfiltered conversations about community, creativity, and what it genuinely means to win in life. No fluff. No pretense. Just mildly interesting stuff.</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">About the Show</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">&#127897;</div>
                <p className="text-white font-semibold">Wesley &amp; Basma</p>
                <p className="text-gray-400 text-sm">Your hosts from Las Vegas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">&#128506;</div>
                <p className="text-white font-semibold">Las Vegas &amp; Beyond</p>
                <p className="text-gray-400 text-sm">Community stories from NV &amp; nationwide</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">&#128172;</div>
                <p className="text-white font-semibold">Real Conversations</p>
                <p className="text-gray-400 text-sm">No scripts. Just honesty.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">Episodes</h2>
          <div className="flex flex-col gap-5 mb-16">
            {episodes.map((ep, i) => (
              <div key={i} className="bg-yellow-900/10 border border-yellow-800/50 hover:border-yellow-500 rounded-2xl p-6 transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-yellow-500 text-sm font-bold">{ep.number}</span>
                  <span className="text-gray-500 text-sm">{ep.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{ep.title}</h3>
                <p className="text-yellow-400 text-sm mb-3">with {ep.guest}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{ep.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {ep.tags.map(tag => (
                    <span key={tag} className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-yellow-900/30 to-black border border-yellow-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Never Miss an Episode</h2>
            <p className="text-gray-400 mb-6">Follow along for new episodes, behind-the-scenes, and community highlights.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition">
                Follow on Instagram
              </a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
                className="bg-transparent border border-yellow-600 hover:border-yellow-400 text-yellow-400 font-semibold px-6 py-3 rounded-full transition">
                All Podcast Links
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
