import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'BASMA — Become A Singer Music Academy | BasmaWorld',
  description: 'BASMA — Become A Singer Music Academy. Gamified music lessons, professional vocal coaching, and Basma as a professional singer-songwriter and artist.',
}

export default function BASMA() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero */}
        <section className="relative h-[80vh] flex items-end pb-20 px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-singer.jpg" alt="BASMA Become A Singer Music Academy"
              className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Become A Singer Music Academy</p>
            <h1 className="text-6xl font-bold text-white mb-4">BASMA</h1>
            <p className="text-gray-300 text-xl mb-10">Learn. Perform. Become.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/basma/academy" className="bg-purple-600 hover:bg-purple-500 px-7 py-3 rounded-full font-bold transition hover:scale-105">🎓 Join the Academy</Link>
              <Link href="/basma/artist" className="bg-white/10 hover:bg-white/20 border border-white/30 px-7 py-3 rounded-full font-bold transition">🎤 Basma The Artist</Link>
              <Link href="/basma/lessons" className="bg-yellow-500 hover:bg-yellow-400 text-black px-7 py-3 rounded-full font-bold transition">💼 Pro Lessons</Link>
            </div>
          </div>
        </section>

        {/* 3 sections */}
        <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-3 gap-6">
          <Link href="/basma/academy" className="group relative rounded-2xl overflow-hidden">
            <img src="/images/basma-academy.jpg" alt="BASMA music academy" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <h2 className="text-lg font-bold text-white">🎓 The Academy</h2>
              <p className="text-gray-400 text-xs mt-1">Gamified lessons, XP & Skill Tree</p>
            </div>
          </Link>
          <Link href="/basma/artist" className="group relative rounded-2xl overflow-hidden">
            <img src="/images/basma-artist.jpg" alt="Basma professional singer artist" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <h2 className="text-lg font-bold text-white">🎤 The Artist</h2>
              <p className="text-gray-400 text-xs mt-1">Singer, songwriter & performer</p>
            </div>
          </Link>
          <Link href="/basma/lessons" className="group relative rounded-2xl overflow-hidden">
            <img src="/images/basma-hero.jpg" alt="Professional singing lessons with Basma" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <h2 className="text-lg font-bold text-white">💼 Pro Lessons</h2>
              <p className="text-gray-400 text-xs mt-1">1-on-1 professional coaching</p>
            </div>
          </Link>
        </section>

        {/* TikTok marketing strip */}
        <section className="border-t border-white/10 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Free Content</p>
            <h2 className="text-2xl font-bold mb-4">Learn Music For Free on TikTok</h2>
            <p className="text-gray-400 mb-6">270k+ students already learning with Basma. Join the community for free music tips, lessons, and behind-the-scenes content.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition">
                🎵 @basma_singer — 270k+
              </a>
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full font-bold transition">
                🎭 @basmateachme
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
