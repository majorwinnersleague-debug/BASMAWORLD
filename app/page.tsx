'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* HERO — full bleed photo */}
        <section className="relative min-h-screen flex items-end pb-20 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/basma-hero.jpg"
              alt="Basma — artist, educator, community leader"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              BasmaWorld
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-4 font-light">From Melodies to Movements — Changing the Game</p>
            <p className="text-gray-400 mb-10 text-lg">Music. Community. Opportunity.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/mwl" className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-yellow-500/20">
                🏆 Major Winners League
              </Link>
              <Link href="/basma" className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-full font-bold text-lg transition hover:scale-105 shadow-lg shadow-purple-500/20">
                🎵 BASMA Academy
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT BASMA — photo + text */}
        <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/images/basma-about.jpg"
              alt="Basma Awada — Music educator and community leader in Las Vegas"
              className="rounded-2xl w-full object-cover shadow-2xl shadow-purple-900/30"
              style={{maxHeight: '500px', objectFit: 'cover'}}
            />
            <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg">
              300k+ Students Worldwide 🌍
            </div>
          </div>
          <div>
            <p className="text-yellow-400 font-semibold uppercase tracking-widest text-sm mb-3">Meet Basma</p>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Singer. Educator.<br/>Community Leader.</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Basma is a multi-instrumentalist, MPA, professional vocal coach, and community activist based in Las Vegas. 
              With 300k+ followers learning music through her content, she brings together artistry, education, and social impact under one roof — <span className="text-white font-semibold">BasmaWorld</span>.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/basma/artist" className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full text-sm font-semibold transition">🎤 As An Artist</Link>
              <Link href="/mwl" className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-sm font-semibold transition">🏆 Community Work</Link>
            </div>
          </div>
        </section>

        {/* TWO WORLDS */}
        <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-8">
          {/* MWL Card */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/basma-mwl.jpg" alt="Major Winners League community events Las Vegas"
              className="w-full h-80 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Community & Social Impact</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">Major Winners League</h3>
              <p className="text-gray-300 text-sm mb-4">Events, interviews, motivation, Hopes Chance & Vegan Survivors</p>
              <Link href="/mwl" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm transition">
                Explore MWL →
              </Link>
            </div>
          </div>
          {/* BASMA Card */}
          <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
            <img src="/images/basma-singer.jpg" alt="BASMA Become A Singer Music Academy"
              className="w-full h-80 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Music Academy & Artist</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-2">BASMA</h3>
              <p className="text-gray-300 text-sm mb-4">Become A Singer Music Academy — gamified lessons, live coaching & artist content</p>
              <Link href="/basma" className="inline-block bg-purple-600 hover:bg-purple-500 font-bold px-5 py-2 rounded-full text-sm transition">
                Explore BASMA →
              </Link>
            </div>
          </div>
        </section>

        {/* QUICK LINKS ROW */}
        <section className="border-t border-white/10 py-10">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-4">
            <Link href="/hopes" className="bg-green-900/40 hover:bg-green-800/60 border border-green-700 px-5 py-3 rounded-full text-sm font-medium transition">🤝 Hopes Chance</Link>
            <Link href="/vegan-survivors" className="bg-orange-900/40 hover:bg-orange-800/60 border border-orange-700 px-5 py-3 rounded-full text-sm font-medium transition">🥦 Vegan Survivors</Link>
            <Link href="/basma/artist" className="bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 px-5 py-3 rounded-full text-sm font-medium transition">🎤 Basma The Artist</Link>
            <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-full text-sm font-medium transition">🌍 All Links</a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
