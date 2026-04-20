import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-16 mt-20" style={{ background: '#050505' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, #e4cc7a, #c9a84c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              BasmaWorld
            </h3>
            <p className="text-white/30 text-sm leading-relaxed">
              Music. Community. Opportunity.
            </p>
            <p className="text-white/15 text-xs mt-3">Las Vegas, NV · (702) 788-7369</p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Pages</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/" className="text-white/30 hover:text-white/70 transition-colors">Home</Link>
              <Link href="/academy" className="text-white/30 hover:text-white/70 transition-colors">Academy</Link>
              <Link href="/navigator" className="text-white/30 hover:text-white/70 transition-colors">Navigator</Link>
              <Link href="/game" className="text-white/30 hover:text-white/70 transition-colors">MajorWinners</Link>
              <Link href="/mwl" className="text-white/30 hover:text-white/70 transition-colors">Major Winners League</Link>
              <Link href="/contact" className="text-white/30 hover:text-white/70 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/basma" className="text-white/30 hover:text-white/70 transition-colors">Book a Lesson</Link>
              <Link href="/hopes" className="text-white/30 hover:text-white/70 transition-colors">Hopes Chance — Youth Help</Link>
              <Link href="/privacy" className="text-white/30 hover:text-white/70 transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="https://www.tiktok.com/@basma_singer" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">TikTok</a>
              <a href="https://www.instagram.com/basma.tea" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">Instagram</a>
              <a href="https://www.youtube.com/channel/UChszcJ6HQ4u1NoTs4-06H3w" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">YouTube</a>
              <a href="https://open.spotify.com/artist/1PA6WUf27E53oaHmWPVNBt" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">Spotify</a>
              <a href="https://discord.gg/4nzX2Wb5HW" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">Discord</a>
              <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/70 transition-colors">All Links</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <span>&copy; {new Date().getFullYear()} BASMA LLC &middot; Las Vegas, NV</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white/40 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
