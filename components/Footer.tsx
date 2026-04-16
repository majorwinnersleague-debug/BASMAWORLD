import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-16 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-3">BasmaWorld</h3>
            <p className="text-gray-500 text-sm">Music. Community. Opportunity. Las Vegas, NV</p>
          </div>
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3">MWL</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/mwl" className="hover:text-yellow-400 transition">Major Winners League</Link>
              <Link href="/mwl/i-am-positive" className="hover:text-yellow-400 transition">I Am Positive</Link>
              <Link href="/mwl/podcast" className="hover:text-yellow-400 transition">Podcast</Link>
            </div>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-3">BASMA</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/basma" className="hover:text-purple-400 transition">Music Academy</Link>
              <Link href="/basma/academy" className="hover:text-purple-400 transition">Academy</Link>
              <Link href="/basma/lessons" className="hover:text-purple-400 transition">Lessons</Link>
              <Link href="/basma/artist" className="hover:text-purple-400 transition">Basma Artist</Link>
            </div>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold mb-3">Social</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">TikTok @basma_singer (270k+)</a>
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">TikTok @basmateachme</a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram @basma.tea</a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Linktree</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-gray-600 text-sm">
          <p>2024 BASMA LLC &middot; Las Vegas, NV &middot; <Link href="/hopes" className="hover:text-green-400 transition">Hopes Chance</Link> &middot; <Link href="/vegan-survivors" className="hover:text-orange-400 transition">Vegan Survivors</Link></p>
        </div>
      </div>
    </footer>
  )
}
