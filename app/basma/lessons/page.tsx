import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Professional Singing Lessons | BASMA | BasmaWorld',
  description: 'Professional 1-on-1 singing lessons with Basma — vocal coach in Las Vegas and online. Book your lesson today. Real techniques. Real results.',
  keywords: 'professional singing lessons, vocal coach Las Vegas, online singing lessons, 1 on 1 vocal lessons, singing coach, voice lessons Las Vegas, become a singer',
  openGraph: {
    title: 'Professional Singing Lessons | BASMA',
    description: '1-on-1 singing lessons with Basma. Las Vegas & online. Real techniques. Real results.',
    url: 'https://basmaworld.com/basma/lessons',
    siteName: 'BasmaWorld',
    type: 'website',
  },
}

export default function Lessons() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-300 transition">BasmaWorld</Link>
            <span>/</span>
            <Link href="/basma" className="hover:text-purple-400 transition">BASMA</Link>
            <span>/</span>
            <span className="text-purple-400">Lessons</span>
          </div>

          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#128249;</div>
            <h1 className="text-5xl font-bold text-purple-400 mb-4">Professional Lessons</h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">1-on-1 video lessons with Basma — a professional singer-songwriter and vocal coach based in Las Vegas.</p>
          </div>

          <div className="bg-purple-900/30 border border-purple-600 rounded-2xl p-10 text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-700/40 border border-purple-500 rounded-full px-4 py-2 text-purple-300 text-sm font-medium mb-6">
              Coming Soon
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Professional Video Lessons Are Coming</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">We are building the full lesson booking system. In the meantime, reach out directly to book a session with Basma.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition">
                DM on Instagram to Book
              </a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
                className="bg-transparent border border-purple-600 hover:border-purple-400 text-purple-400 font-semibold px-6 py-3 rounded-full transition">
                All Contact Links
              </a>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">What You Will Get</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {[
              { icon: '&#127919;', title: 'Personalized Curriculum', desc: 'Every lesson is tailored to your voice, goals, and current level. No cookie-cutter plans.' },
              { icon: '&#127908;', title: 'Real Techniques', desc: 'Breath control, pitch, registers, vocal runs, belting — all the tools a professional singer uses.' },
              { icon: '&#128200;', title: 'Measurable Progress', desc: 'You will hear and feel the difference. Each session builds on the last with clear milestones.' },
              { icon: '&#128187;', title: 'Las Vegas & Online', desc: 'In-person lessons in Las Vegas, NV or online via video call — wherever works for you.' },
              { icon: '&#127925;', title: 'Song Coaching', desc: 'Work on actual songs you love. Learn to interpret, style, and perform them like an artist.' },
              { icon: '&#127941;', title: 'Industry Insight', desc: 'Get real talk about the music industry, artist branding, and building a career in music.' },
            ].map((item, i) => (
              <div key={i} className="bg-purple-900/10 border border-purple-800/50 hover:border-purple-600 rounded-xl p-5 transition">
                <div className="flex items-start gap-4">
                  <span className="text-3xl" dangerouslySetInnerHTML={{__html: item.icon}} />
                  <div>
                    <h3 className="font-bold text-purple-300 mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black border border-purple-800/40 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">Start Free While You Wait</h2>
            <p className="text-gray-400 text-sm mb-4">Basma teaches free vocal lessons on TikTok. Start learning right now.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2 rounded-full text-sm transition">
                @basmateachme (Free Lessons)
              </a>
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="bg-purple-900/40 border border-purple-700 hover:border-purple-500 text-purple-300 font-semibold px-5 py-2 rounded-full text-sm transition">
                @basma_singer (270k+)
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
