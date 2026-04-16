import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Basma — Professional Singer, Songwriter & Vocal Coach | BasmaWorld',
  description: 'Basma is a professional singer-songwriter, multi-instrumentalist and vocal coach based in Las Vegas. Follow her music on Instagram, TikTok and Vevo.',
}

export default function BASMAArtist() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">

        {/* Hero — full bleed artist photo */}
        <section className="relative h-screen flex items-end pb-20 px-4">
          <div className="absolute inset-0">
            <img src="/images/basma-artist.jpg" alt="Basma — professional singer songwriter Las Vegas"
              className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">Singer • Songwriter • Performer</p>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">BASMA</h1>
            <p className="text-gray-300 text-xl mb-8">Multi-instrumentalist. MPA. Vocal Coach. Las Vegas.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 px-6 py-3 rounded-full font-semibold transition">
                📸 @basma.tea on Instagram
              </a>
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer"
                className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-semibold transition">
                🎵 @basma_singer on TikTok
              </a>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="max-w-5xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="/images/basma-community.jpg" alt="Basma performing and connecting with community"
              className="rounded-2xl w-full object-cover shadow-2xl" style={{maxHeight: '450px', objectFit: 'cover'}} />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">The Artist Behind the Movement</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              With a Master of Performing Arts and over 300k students learning music through her content, 
              Basma is one of Las Vegas's most dynamic musical voices. She blends soulful original music 
              with a passion for teaching and community building.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              As a professional singer-songwriter, she performs original compositions across genres — 
              bringing raw emotion, technical precision, and authentic storytelling to every performance.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-purple-900/30 border border-purple-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">300k+</div>
                <div className="text-xs text-gray-400 mt-1">Students</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">MPA</div>
                <div className="text-xs text-gray-400 mt-1">Degree</div>
              </div>
              <div className="bg-purple-900/30 border border-purple-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">270k+</div>
                <div className="text-xs text-gray-400 mt-1">TikTok</div>
              </div>
            </div>
          </div>
        </section>

        {/* Vevo Coming Soon */}
        <section className="bg-gradient-to-r from-purple-900/20 to-black border-y border-purple-800/30 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold mb-3">Vevo — Coming Soon</h2>
            <p className="text-gray-400 text-lg">Official music videos dropping on Vevo. Follow on Instagram & TikTok to be the first to know.</p>
            <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer"
              className="inline-block mt-6 bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-full font-semibold transition">
              Follow @basma.tea for Updates
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
