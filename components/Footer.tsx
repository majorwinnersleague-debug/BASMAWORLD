import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-14 mt-20" style={{ background: '#050505' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3
              className="text-lg font-semibold mb-2 gradient-gold inline-block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              BasmaWorld
            </h3>
            <p className="text-white/25 text-sm">Music. Community. Opportunity.</p>
            <p className="text-white/10 text-xs mt-2">Las Vegas, NV</p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest mb-3">Pages</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-white/25 hover:text-white/50 transition-colors">Home</Link>
              <Link href="/academy" className="text-white/25 hover:text-white/50 transition-colors">Academy</Link>
              <Link href="/game" className="text-white/25 hover:text-white/50 transition-colors">Game</Link>
              <Link href="/navigator" className="text-white/25 hover:text-white/50 transition-colors">Navigator</Link>
              <Link href="/contact" className="text-white/25 hover:text-white/50 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest mb-3">More</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/basma" className="text-white/25 hover:text-white/50 transition-colors">Book a Lesson</Link>
              <Link href="/hopes" className="text-white/25 hover:text-white/50 transition-colors">Hopes Chance</Link>
              <Link href="/mwl" className="text-white/25 hover:text-white/50 transition-colors">Major Winners League</Link>
              <Link href="/privacy" className="text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/40 text-xs uppercase tracking-widest mb-3">Connect</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-white/50 transition-colors">TikTok</a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-white/50 transition-colors">Instagram</a>
              <a href="https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w" target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-white/50 transition-colors">YouTube</a>
              <a href="https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt" target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-white/50 transition-colors">Spotify</a>
            </div>
          </div>
        </div>

        <div className="divider mb-5" />
        <p className="text-center text-xs text-white/15">&copy; {new Date().getFullYear()} BASMA LLC</p>
      </div>
    </footer>
  )
}
