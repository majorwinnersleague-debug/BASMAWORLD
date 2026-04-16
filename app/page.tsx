'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent">
            BasmaWorld
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4">Music. Community. Opportunity.</p>
          <p className="text-gray-500 mb-16 max-w-xl">Two worlds. One mission. Elevate your music &amp; uplift your community.</p>

          {/* Two Main Branch Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-20">
            {/* MWL Card */}
            <div className="relative group bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-600/50 hover:border-yellow-400 rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="text-5xl mb-4">&#127942;</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-3">Major Winners League</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">Community, social impact, motivational content, and the Mildly Interesting podcast. Where winners uplift others.</p>
              <div className="flex flex-col gap-2 mb-8">
                <span className="text-gray-400 text-sm">&#10022; I Am Positive — Motivational Talks &amp; Poetry</span>
                <span className="text-gray-400 text-sm">&#10022; Mildly Interesting Podcast w/ Wesley</span>
                <span className="text-gray-400 text-sm">&#10022; Hopes Chance Youth Resources</span>
                <span className="text-gray-400 text-sm">&#10022; Vegan Survivors Health Hub</span>
              </div>
              <Link href="/mwl" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition">
                Explore MWL →
              </Link>
            </div>

            {/* BASMA Card */}
            <div className="relative group bg-gradient-to-br from-purple-900/40 to-black border border-purple-600/50 hover:border-purple-400 rounded-3xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="text-5xl mb-4">&#127925;</div>
              <h2 className="text-3xl font-bold text-purple-400 mb-3">BASMA</h2>
              <p className="text-gray-300 mb-2 font-semibold text-purple-300">Become A Singer Music Academy</p>
              <p className="text-gray-300 mb-6 leading-relaxed">Gamified music lessons, Skill Tree, XP, Echo AI mentor, and professional paid lessons — plus Basma as an artist.</p>
              <div className="flex flex-col gap-2 mb-8">
                <span className="text-gray-400 text-sm">&#10022; Academy — Gamified Lessons &amp; Skill Tree</span>
                <span className="text-gray-400 text-sm">&#10022; Professional Paid Video Lessons</span>
                <span className="text-gray-400 text-sm">&#10022; Basma as Artist — Vevo &amp; Instagram</span>
                <span className="text-gray-400 text-sm">&#10022; Free TikTok Content</span>
              </div>
              <Link href="/basma" className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition">
                Explore BASMA →
              </Link>
            </div>
          </div>

          {/* Quick Links Row */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/hopes" className="bg-green-700/30 hover:bg-green-700/50 border border-green-600 text-green-300 px-5 py-2 rounded-full text-sm font-medium transition">
              Hopes Chance
            </Link>
            <Link href="/vegan-survivors" className="bg-orange-700/30 hover:bg-orange-700/50 border border-orange-600 text-orange-300 px-5 py-2 rounded-full text-sm font-medium transition">
              Vegan Survivors
            </Link>
            <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 px-5 py-2 rounded-full text-sm font-medium transition">
              TikTok @basma_singer (270k+)
            </a>
            <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 px-5 py-2 rounded-full text-sm font-medium transition">
              Linktree
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
