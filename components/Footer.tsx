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
              <Link href="/mwl#positive" className="hover:text-yellow-400 transition">I Am Positive</Link>
              <Link href="/mwl/podcast" className="hover:text-yellow-400 transition">Podcast</Link>
            </div>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-3">BASMA</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/basma" className="hover:text-purple-400 transition">Music Academy</Link>
              <Link href="/academy" className="hover:text-purple-400 transition">Academy</Link>
              <Link href="/academy" className="hover:text-purple-400 transition">Book a Lesson</Link>
              <Link href="/basma" className="hover:text-purple-400 transition">Meet Basma</Link>
              <Link href="/wins" className="hover:text-purple-400 transition">Student Wins</Link>
              <Link href="/blog" className="hover:text-purple-400 transition">Music Blog</Link>
              <Link href="/gateway" className="hover:text-yellow-400 transition">Gateway Festival</Link>
            </div>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold mb-3">Connect</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎵 TikTok @basma_singer (300K+)</a>
              <a href="https://www.tiktok.com/@basmateachme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🪆 TikTok @basmateachme</a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📸 Instagram</a>
              <a href="https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📺 YouTube</a>
              <a href="https://www.youtube.com/channel/UC7Okrsw96-s0bHg9wEPkvuQ?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎬 BASMASINGER</a>
              <a href="https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎧 Spotify</a>
              <a href="https://itunes.apple.com/us/artist/1543777421" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🍎 Apple Music</a>
              <a href="https://discord.gg/4nzX2Wb5HW" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">💬 Discord</a>
              <a href="https://m.twitch.tv/basmasinger" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎮 Twitch</a>
              <a href="https://www.facebook.com/share/y5V8Jm2dKTpCGbc4/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">📘 Facebook</a>
              <a href="https://twitter.com/BASMA_music" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🐦 Twitter/X</a>
              <a href="https://v.lemon8-app.com/al/OgQQshrUcv" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🍋 Lemon8</a>
              <a href="https://open.spotify.com/show/0i0tC040EavARkiFoDIR5j" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🎙️ R.O.F.L. Podcast</a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🌍 All Links (Linktree)</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-gray-600 text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>© 2026 BASMA LLC · Las Vegas, NV</span>
            <span className="text-white/20">·</span>
            <Link href="/academy" className="hover:text-purple-400 transition">Academy</Link>
            <span className="text-white/20">·</span>
            <Link href="/hopes" className="hover:text-green-400 transition">Hopes Chance</Link>
            <span className="text-white/20">·</span>
            <Link href="/mwl" className="hover:text-yellow-400 transition">MWL</Link>
            <span className="text-white/20">·</span>
            <span className="text-white/30">Powered by BasmaWorld</span>
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
