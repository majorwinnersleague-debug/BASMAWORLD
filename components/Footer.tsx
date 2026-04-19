import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-16 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold mb-3">BasmaWorld</h3>
            <p className="text-gray-500 text-sm">Music. Marketing. Community.</p>
            <p className="text-gray-600 text-xs mt-2">Las Vegas, NV · (702) 788-7369</p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-gray-300 font-semibold mb-3">Pages</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/mwl" className="hover:text-yellow-400 transition">Major Winners League</Link>
              <Link href="/mwm" className="hover:text-blue-400 transition">Major Winners Marketing</Link>
              <Link href="/basma" className="hover:text-purple-400 transition">BASMA Music Academy</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-300 font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/basma" className="hover:text-purple-400 transition">Book a Lesson ($29)</Link>
              <Link href="/mwm" className="hover:text-blue-400 transition">Free Marketing Consultation</Link>
              <Link href="/mwl" className="hover:text-green-400 transition">Hopes Chance (Youth Help)</Link>
              <Link href="/privacy" className="hover:text-white/40 transition">Privacy Policy</Link>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-gray-300 font-semibold mb-3">Connect</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎵 TikTok (300K+)</a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📸 Instagram</a>
              <a href="https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📺 YouTube</a>
              <a href="https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎧 Spotify</a>
              <a href="https://discord.gg/4nzX2Wb5HW" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">💬 Discord</a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🌍 All Links (Linktree)</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-600 text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© 2026 BASMA LLC · Las Vegas, NV</span>
            <span className="text-white/20">·</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span className="text-white/20">·</span>
            <Link href="/mwm" className="hover:text-blue-400 transition">MWM</Link>
            <span className="text-white/20">·</span>
            <Link href="/basma" className="hover:text-purple-400 transition">BASMA</Link>
            <span className="text-white/20">·</span>
            <Link href="/privacy" className="hover:text-white/40 transition">Privacy</Link>
            <span className="text-white/20">·</span>
            <Link href="/contact" className="hover:text-white/40 transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
