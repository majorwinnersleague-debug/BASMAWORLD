import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BillyChat from '@/components/BillyChat'

export const metadata: Metadata = {
  title: 'Vegan Survivors | Healthy Living for Youth',
  description: 'Vegan Survivors — healthy eating, plant-based recipes, and exercise for youth. Part of Major Winners League. Watch on YouTube and join the Facebook community.',
  keywords: 'Vegan Survivors, plant-based youth, healthy eating teens, vegan recipes kids, MWL healthy living, vegan Las Vegas, Basma vegan',
  openGraph: {
    title: 'Vegan Survivors | Healthy Living for Youth',
    description: 'Plant-based recipes, healthy eating, and exercise for youth — from Major Winners League.',
    url: 'https://basmaworld.com/mwl/vegan-survivors',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

const pillars = [
  {
    emoji: '🥗',
    title: 'Plant-Based Recipes',
    desc: 'Delicious, affordable, and youth-friendly vegan recipes that actually taste incredible. No excuses. Just good food.',
    color: '#4ade80',
  },
  {
    emoji: '🏃',
    title: 'Exercise & Movement',
    desc: 'Fun fitness routines designed for young people — from beginners to athletes. Move your body, change your life.',
    color: '#4ade80',
  },
  {
    emoji: '🧠',
    title: 'Mind & Body Wellness',
    desc: 'Healthy living is more than food. We cover mental wellness, sleep, and the holistic habits that make winners.',
    color: '#4ade80',
  },
  {
    emoji: '🌱',
    title: 'Sustainable Choices',
    desc: 'How everyday food decisions connect to the planet. Easy swaps, big impact. The earth thanks you.',
    color: '#4ade80',
  },
]

const quickTips = [
  '💧 Drink water first — before coffee, before scrolling, before anything.',
  '🥑 Add one plant-based meal to your day and build from there.',
  '🏃 Even a 10-minute walk beats zero movement.',
  '🛒 Shop the perimeter of the grocery store — that\'s where the real food lives.',
  '😴 Sleep is a superpower. Treat it like one.',
  '🫁 Deep breathing reduces stress instantly. Do it right now. Go.',
]

export default function MWLVeganSurvivors() {
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
            <span className="text-green-400">Vegan Survivors</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="text-7xl mb-4">🥦</div>
            <p className="text-green-400 font-bold uppercase tracking-widest text-sm mb-3">
              Major Winners League · Healthy Living
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-green-400 mb-4">
              Vegan Survivors
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              Real food. Real movement. Real results. Healthy eating, plant-based recipes, and
              exercise built for youth who are ready to win at life.
            </p>
          </div>

          {/* Quote */}
          <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-8 mb-14 text-center">
            <blockquote className="text-2xl font-semibold text-green-300 italic leading-relaxed">
              &quot;You don&apos;t need to be perfect. You just need to start. One meal, one walk, one choice — that&apos;s how survivors are built.&quot;
            </blockquote>
            <p className="text-gray-500 mt-3 text-sm">— Vegan Survivors, Major Winners League</p>
          </div>

          {/* Four Pillars */}
          <h2 className="text-3xl font-bold text-white mb-6">What We&apos;re About</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="bg-green-900/10 border border-green-800/50 hover:border-green-600 rounded-2xl p-6 transition hover:bg-green-900/20"
              >
                <div className="text-4xl mb-3">{p.emoji}</div>
                <h3 className="text-lg font-bold text-green-400 mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="bg-green-900/15 border border-green-800/50 rounded-2xl p-8 mb-14">
            <h2 className="text-2xl font-bold text-white mb-5">⚡ Quick Wins — Start Today</h2>
            <ul className="flex flex-col gap-3">
              {quickTips.map((tip, i) => (
                <li
                  key={i}
                  className="text-gray-300 text-sm leading-relaxed border-b border-green-900/40 pb-3 last:border-0 last:pb-0"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* YouTube CTA */}
          <div className="bg-green-900/20 border border-green-700 rounded-2xl p-8 mb-8 text-center">
            <div className="text-5xl mb-4">▶️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Watch on YouTube</h2>
            <p className="text-gray-400 mb-6">
              Full recipe videos, health deep-dives, exercise guides, and more on the Vegan Survivors YouTube channel.
              Real content for real people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.youtube.com/@VeganSurvivors"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-full transition inline-flex items-center gap-2 justify-center"
              >
                🥦 Watch on YouTube
              </a>
              <a
                href="https://www.facebook.com/VeganSurvivors"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition inline-flex items-center gap-2 justify-center"
              >
                👥 Join on Facebook
              </a>
            </div>
          </div>

          {/* Facebook Community */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Join the Facebook Community</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Connect with other Vegan Survivors on Facebook. Share recipes, celebrate wins, ask questions,
                  and be part of a community that actually shows up for each other.
                </p>
                <a
                  href="https://www.facebook.com/VeganSurvivors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-full transition text-sm inline-block"
                >
                  🔗 Find Us on Facebook
                </a>
              </div>
            </div>
          </div>

          {/* MWL connection */}
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-8 mb-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">Part of Major Winners League</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto mb-4">
              Vegan Survivors is proudly part of the MWL family — a movement that believes healthy bodies, healthy minds,
              and strong communities are the foundation of winning. You can&apos;t pour from an empty cup. Take care of yourself first.
            </p>
            <Link href="/mwl" className="text-yellow-400 hover:text-yellow-300 transition text-sm font-semibold">
              ← Explore Major Winners League
            </Link>
          </div>

        </div>
      </main>
      <Footer />
      <BillyChat page="general" />
    </>
  )
}
