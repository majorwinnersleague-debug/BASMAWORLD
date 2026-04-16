import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-white to-green-400 bg-clip-text text-transparent">
            BasmaWorld
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12">Music. Community. Opportunity.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/academy" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-full font-semibold text-lg transition hover:scale-105">
              🎵 Music Academy
            </Link>
            <Link href="/mwl" className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-semibold text-lg transition hover:scale-105">
              🏆 Major Winners League
            </Link>
            <Link href="/hopes" className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-full font-semibold text-lg transition hover:scale-105">
              🤝 Hopes Chance
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
