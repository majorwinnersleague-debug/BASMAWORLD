import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Basma — Artist | Singer-Songwriter | BasmaWorld',
  description: 'Basma is a professional singer-songwriter based in Las Vegas. Watch on Vevo, follow on Instagram, and experience music that moves you.',
  keywords: 'Basma singer songwriter, Las Vegas singer, Basma music, Vevo artist, professional singer Las Vegas, become a singer music academy, vocal artist Las Vegas',
  openGraph: {
    title: 'Basma — Professional Singer-Songwriter',
    description: 'Experience the music of Basma — Las Vegas singer-songwriter. Vevo, Instagram, TikTok.',
    url: 'https://basmaworld.com/basma/artist',
    siteName: 'BasmaWorld',
    type: 'music',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basma — Artist',
    description: 'Professional singer-songwriter from Las Vegas. 270k+ TikTok followers.',
    creator: '@basma_singer',
  },
}

const platforms = [
  {
    name: 'TikTok @basma_singer',
    desc: '270,000+ followers. Original songs, covers, and the life of a working artist.',
    icon: '&#127925;',
    href: 'https://www.tiktok.com/@basma_singer',
    badge: '270k+ followers'
  },
  {
    name: 'Instagram @basma.tea',
    desc: 'Behind the scenes, new releases, and the journey of a Las Vegas artist.',
    icon: '&#128248;',
    href: 'https://www.instagram.com/basma.tea',
    badge: 'Follow'
  },
  {
    name: 'TikTok @basmateachme',
    desc: 'Basma teaches vocal technique — free lessons for aspiring singers.',
    icon: '&#127891;',
    href: 'https://www.tiktok.com/@basmateachme',
    badge: 'Free Lessons'
  },
  {
    name: 'Linktree — All Links',
    desc: 'All music, social media, and booking links in one place.',
    icon: '&#128279;',
    href: 'https://linktr.ee/BASMATea',
    badge: 'Hub'
  },
]

export default function BasmaArtist() {
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
            <span className="text-purple-400">Artist</span>
          </div>

          <div className="text-center mb-16">
            <div className="text-6xl mb-4">&#127775;</div>
            <h1 className="text-5xl font-bold text-purple-400 mb-3">Basma</h1>
            <p className="text-2xl text-gray-300 mb-2">Singer &mdash; Songwriter &mdash; Vocal Coach</p>
            <p className="text-gray-500 text-lg">Las Vegas, Nevada &middot; 270,000+ TikTok followers</p>
          </div>

          <div className="bg-purple-900/20 border border-purple-700/50 rounded-2xl p-8 mb-12 text-center">
            <blockquote className="text-xl font-semibold text-purple-200 italic leading-relaxed max-w-2xl mx-auto">
              &quot;I make music because it saved my life. And now I teach it because I want it to save yours too. Every song is a story. Every lesson is a door.&quot;
            </blockquote>
            <p className="text-gray-500 mt-4 text-sm">— Basma</p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-6">Listen &amp; Follow</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {platforms.map((platform, i) => (
              <a key={i} href={platform.href} target="_blank" rel="noopener noreferrer"
                className="group bg-purple-900/10 border border-purple-800/50 hover:border-purple-500 rounded-xl p-6 transition hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl" dangerouslySetInnerHTML={{__html: platform.icon}} />
                  <span className="bg-purple-900/40 border border-purple-700 text-purple-300 text-xs px-3 py-1 rounded-full">{platform.badge}</span>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition">{platform.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{platform.desc}</p>
              </a>
            ))}
          </div>

          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 mb-12 text-center">
            <div className="text-4xl mb-3">&#128250;</div>
            <h2 className="text-2xl font-bold text-red-400 mb-3">Vevo</h2>
            <p className="text-gray-400 mb-4">Official music videos on Vevo — professional visual storytelling to match Basma&apos;s original music.</p>
            <a href="https://www.vevo.com" target="_blank" rel="noopener noreferrer"
              className="bg-red-700 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition inline-block">
              Watch on Vevo
            </a>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">The Story</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: '&#127908;', title: 'The Artist', desc: 'Original songs that blend vulnerability, power, and truth. Basma writes from real experience.' },
                { icon: '&#127891;', title: 'The Teacher', desc: '270k+ TikTok followers choose @basmateachme for vocal technique they can actually use.' },
                { icon: '&#128156;', title: 'The Mission', desc: 'Prove that becoming a singer is not reserved for the lucky. It is built, lesson by lesson, day by day.' },
              ].map((item, i) => (
                <div key={i} className="bg-black border border-purple-900/50 rounded-xl p-5 text-center">
                  <div className="text-4xl mb-3" dangerouslySetInnerHTML={{__html: item.icon}} />
                  <h3 className="font-bold text-purple-300 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/basma/lessons" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-full transition">
                Book a Lesson
              </Link>
              <Link href="/basma/academy" className="bg-transparent border border-purple-600 hover:border-purple-400 text-purple-400 font-semibold px-6 py-3 rounded-full transition">
                Enter the Academy
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
