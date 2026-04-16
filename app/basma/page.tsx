import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BASMA — Become A Singer Music Academy | BasmaWorld',
  description: 'BASMA — Become A Singer Music Academy. Gamified music lessons, Skill Tree, XP system, Echo AI mentor, professional vocal coaching in Las Vegas and online.',
  keywords: 'become a singer music academy, professional singing lessons, vocal coach Las Vegas, online singing lessons, music academy Las Vegas, BASMA music, singing lessons online',
  openGraph: {
    title: 'BASMA — Become A Singer Music Academy',
    description: 'Gamified music academy. Skill Tree. XP. Echo AI mentor. Professional vocal coaching in Las Vegas & online.',
    url: 'https://basmaworld.com/basma',
    siteName: 'BasmaWorld',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BASMA Music Academy',
    description: 'Become A Singer Music Academy — gamified lessons, Skill Tree, XP & Echo AI.',
    creator: '@basma_singer',
  },
}

export default function BASMA() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127925;</div>
            <h1 className="text-5xl font-bold text-purple-400 mb-3">BASMA</h1>
            <p className="text-2xl text-gray-300 mb-4 font-semibold">Become A Singer Music Academy</p>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Gamified music lessons. Skill Tree. XP. Echo AI mentor. Professional vocal coaching in Las Vegas &amp; online. Your journey from student to artist starts here.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link href="/basma/academy" className="group bg-gradient-to-br from-purple-900/40 to-black border border-purple-700/50 hover:border-purple-400 rounded-2xl p-7 text-center transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4">&#127918;</div>
              <h2 className="text-xl font-bold text-purple-400 mb-2">Academy</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Gamified lessons, Skill Tree, XP system, and Echo your AI music mentor. Level up your voice.</p>
              <span className="text-purple-400 text-sm font-semibold group-hover:underline">Start Learning →</span>
            </Link>

            <Link href="/basma/lessons" className="group bg-gradient-to-br from-purple-900/40 to-black border border-purple-700/50 hover:border-purple-400 rounded-2xl p-7 text-center transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4">&#128249;</div>
              <h2 className="text-xl font-bold text-purple-400 mb-2">Lessons</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Professional 1-on-1 video lessons with Basma. Real techniques. Real results. Las Vegas &amp; online.</p>
              <span className="text-purple-400 text-sm font-semibold group-hover:underline">View Lessons →</span>
            </Link>

            <Link href="/basma/artist" className="group bg-gradient-to-br from-purple-900/40 to-black border border-purple-700/50 hover:border-purple-400 rounded-2xl p-7 text-center transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4">&#127775;</div>
              <h2 className="text-xl font-bold text-purple-400 mb-2">Basma Artist</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Basma as a professional singer-songwriter. Vevo, Instagram, TikTok — experience the music.</p>
              <span className="text-purple-400 text-sm font-semibold group-hover:underline">Listen Now →</span>
            </Link>
          </div>

          <div className="bg-purple-900/20 border border-purple-700/50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Free Content</h2>
            <p className="text-gray-400 mb-8">Start learning for free. Basma&apos;s TikToks cover real vocal techniques, music tips, and behind-the-scenes of being an artist.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/40 border border-purple-800/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">&#127925;</span>
                  <div>
                    <h3 className="font-bold text-white">@basma_singer</h3>
                    <p className="text-purple-400 text-sm">270,000+ followers</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">Original songs, artist life, and music that moves you. See what is possible when you commit to your craft.</p>
                <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-full text-sm transition inline-block">
                  Follow on TikTok →
                </a>
              </div>
              <div className="bg-black/40 border border-purple-800/50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">&#127891;</span>
                  <div>
                    <h3 className="font-bold text-white">@basmateachme</h3>
                    <p className="text-purple-400 text-sm">BasmaTeachMe &middot; Free Lessons</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">Free vocal lessons, technique breakdowns, and music education. Learn from a working professional.</p>
                <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-full text-sm transition inline-block">
                  Follow on TikTok →
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Follow Basma</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="bg-purple-900/30 border border-purple-700 hover:border-purple-400 text-purple-300 px-5 py-2.5 rounded-full text-sm font-medium transition">
                TikTok @basma_singer (270k+)
              </a>
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                className="bg-purple-900/30 border border-purple-700 hover:border-purple-400 text-purple-300 px-5 py-2.5 rounded-full text-sm font-medium transition">
                TikTok @basmateachme
              </a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-purple-900/30 border border-purple-700 hover:border-purple-400 text-purple-300 px-5 py-2.5 rounded-full text-sm font-medium transition">
                Instagram @basma.tea
              </a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition">
                All Links
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
