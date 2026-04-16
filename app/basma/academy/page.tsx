import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BASMA Academy — Gamified Music Lessons | BasmaWorld',
  description: 'BASMA Academy — gamified music lessons, Skill Tree, XP system, and Echo your AI music mentor. Become a singer through the most engaging music school online.',
  keywords: 'become a singer music academy, online singing lessons, gamified music lessons, music skill tree, vocal coach Las Vegas, online music academy, Echo AI music mentor',
  openGraph: {
    title: 'BASMA Academy — Gamified Music Lessons',
    description: 'Level up your voice. Earn XP. Unlock your Skill Tree. Guided by Echo, your AI music mentor.',
    url: 'https://basmaworld.com/basma/academy',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

const paths = [
  {
    icon: '&#127928;',
    title: 'Music Path',
    desc: 'Core instrument & theory lessons. Master your craft from fundamentals to performance-ready.',
    skills: ['Pitch & Intonation', 'Breath Control', 'Vocal Registers', 'Song Interpretation', 'Performance Confidence'],
  },
  {
    icon: '&#127912;',
    title: 'Branding Path',
    desc: 'Music marketing, social media strategy & personal brand building for artists.',
    skills: ['Artist Identity', 'Content Strategy', 'TikTok for Musicians', 'Audience Building', 'Music Promotion'],
  },
  {
    icon: '&#128154;',
    title: 'Health Path',
    desc: 'Artist wellness, vocal health, performance mindset & the mental game of a music career.',
    skills: ['Vocal Warm-Ups', 'Stress & Performance', 'Nutrition for Singers', 'Sleep & Recovery', 'Mental Resilience'],
  },
]

export default function Academy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/basma" className="hover:text-purple-400 transition">BASMA</Link>
            <span>/</span>
            <span className="text-purple-400">Academy</span>
          </div>

          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127918;</div>
            <h1 className="text-5xl font-bold text-purple-400 mb-4">BASMA Academy</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">Level up your music. Earn XP. Unlock your Skill Tree. Guided by <span className="text-purple-400 font-semibold">Echo</span>, your AI music mentor.</p>
          </div>

          <div className="bg-purple-900/30 border border-purple-600 rounded-2xl p-6 mb-12 flex flex-wrap gap-6 justify-around text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400">XP</div>
              <p className="text-gray-400 text-sm mt-1">Earn points for every lesson</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">Tree</div>
              <p className="text-gray-400 text-sm mt-1">Unlock skills in order</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">Badges</div>
              <p className="text-gray-400 text-sm mt-1">Celebrate every milestone</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">Echo</div>
              <p className="text-gray-400 text-sm mt-1">AI mentor tracks your growth</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {paths.map(path => (
              <div key={path.title} className="bg-purple-900/20 border border-purple-800 hover:border-purple-600 rounded-2xl p-6 transition">
                <div className="text-4xl mb-4" dangerouslySetInnerHTML={{__html: path.icon}} />
                <h2 className="text-xl font-bold text-white mb-2">{path.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{path.desc}</p>
                <ul className="space-y-1">
                  {path.skills.map(skill => (
                    <li key={skill} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-purple-400">&#9658;</span> {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-900/40 to-black border border-purple-700 rounded-2xl p-8 text-center mb-12">
            <div className="text-6xl mb-4">&#129302;</div>
            <h2 className="text-3xl font-bold text-purple-400 mb-3">Meet Echo</h2>
            <p className="text-gray-300 text-lg mb-2">Your personal AI music mentor</p>
            <p className="text-gray-400 max-w-xl mx-auto mb-6">Echo tracks your progress, recommends your next lesson, celebrates your wins, and adjusts your learning path as you grow. Like a vocal coach in your pocket — available 24/7.</p>
            <div className="inline-block bg-purple-700/40 border border-purple-600 rounded-xl px-6 py-3 text-purple-300 text-sm">
              Full Academy with Echo launching soon — join the waitlist below
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
            <p className="text-gray-400 mb-6">Check out free content now, or book a professional lesson while the full academy launches.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/basma/lessons" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition">
                Book a Lesson
              </Link>
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                className="bg-transparent border border-purple-600 hover:border-purple-400 text-purple-400 font-semibold px-6 py-3 rounded-full transition">
                Free Lessons on TikTok
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
