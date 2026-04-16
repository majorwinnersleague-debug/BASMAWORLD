import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Major Winners League | BasmaWorld',
  description: 'Major Winners League — community events, motivational speaking, spoken poetry, and social impact in Las Vegas, Nevada.',
  keywords: 'Las Vegas community events, motivational speaker Las Vegas, nonprofit interviews Nevada, spoken poetry Las Vegas, social impact Nevada, Major Winners League',
  openGraph: {
    title: 'Major Winners League | BasmaWorld',
    description: 'Community, social impact, motivational content, and the Mildly Interesting podcast.',
    url: 'https://basmaworld.com/mwl',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

export default function MWL() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127942;</div>
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">Major Winners League</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Community. Social Impact. Motivation. Where winners lift each other up — Las Vegas &amp; beyond.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Link href="/mwl/i-am-positive" className="group bg-gradient-to-br from-yellow-900/30 to-black border border-yellow-700/50 hover:border-yellow-400 rounded-2xl p-7 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="text-4xl mb-3">&#10027;</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">I Am Positive</h2>
              <p className="text-gray-400 leading-relaxed">Motivational talks, spoken word poetry, and stories of resilience. Shift your mindset. Claim your power.</p>
              <span className="mt-4 inline-block text-yellow-400 text-sm font-semibold group-hover:underline">Explore →</span>
            </Link>

            <Link href="/mwl/podcast" className="group bg-gradient-to-br from-yellow-900/30 to-black border border-yellow-700/50 hover:border-yellow-400 rounded-2xl p-7 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="text-4xl mb-3">&#127897;</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Mildly Interesting</h2>
              <p className="text-gray-400 leading-relaxed">The podcast with Wesley. Real conversations about community, creativity, and what it means to win in life.</p>
              <span className="mt-4 inline-block text-yellow-400 text-sm font-semibold group-hover:underline">Listen →</span>
            </Link>

            <Link href="/hopes" className="group bg-gradient-to-br from-green-900/30 to-black border border-green-700/50 hover:border-green-400 rounded-2xl p-7 transition-all hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
              <div className="text-4xl mb-3">&#129309;</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Hopes Chance</h2>
              <p className="text-gray-400 leading-relaxed">Youth resource navigator for ages 16–30. Find free help for housing, mental health, jobs &amp; more. No judgment.</p>
              <span className="mt-4 inline-block text-green-400 text-sm font-semibold group-hover:underline">Find Resources →</span>
            </Link>

            <Link href="/vegan-survivors" className="group bg-gradient-to-br from-orange-900/30 to-black border border-orange-700/50 hover:border-orange-400 rounded-2xl p-7 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="text-4xl mb-3">&#127807;</div>
              <h2 className="text-2xl font-bold text-orange-400 mb-2">Vegan Survivors</h2>
              <p className="text-gray-400 leading-relaxed">Vegan recipes, plant-based health tips, and a community for thriving on a plant-based lifestyle.</p>
              <span className="mt-4 inline-block text-orange-400 text-sm font-semibold group-hover:underline">Explore →</span>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Connect with MWL</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-yellow-900/30 border border-yellow-700 hover:border-yellow-400 text-yellow-300 px-5 py-2.5 rounded-full text-sm font-medium transition">
                Instagram @basma.tea
              </a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
                className="bg-yellow-900/30 border border-yellow-700 hover:border-yellow-400 text-yellow-300 px-5 py-2.5 rounded-full text-sm font-medium transition">
                All Links (Linktree)
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
