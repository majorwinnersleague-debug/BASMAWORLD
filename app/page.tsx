import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AnnouncementBar from '@/components/AnnouncementBar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen text-white pt-16">

        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="gradient-gold">BASMA</span>
            <span className="text-white"> Summer Camp</span>
          </h1>
          <p className="text-lg text-white/40 mb-2 max-w-xl mx-auto">
            Music classes for all ages · Mon–Thu · Starting June 29
          </p>
          <p className="text-sm text-white/25 mb-10">
            📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
          </p>
          <Link
            href="/enroll"
            className="inline-block px-12 py-5 rounded-full font-bold text-lg transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
          >
            Register for Summer Camp
          </Link>
        </section>

        {/* ── What We Offer ── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: '👶', title: 'Tiny Tots', sub: '5 & Under · 9:00 AM', price: '$25/day' },
              { emoji: '🎵', title: 'Kids Music', sub: '5–17 · 10:00 AM & 11:30 AM', price: 'From $25/day' },
              { emoji: '🎹', title: 'Piano', sub: 'All Ages · 1:30 PM', price: 'From $25/day' },
              { emoji: '🎙️', title: 'Recording', sub: 'All Ages · 2:45 PM', price: 'From $25/day' },
            ].map(c => (
              <div key={c.title} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{c.title}</div>
                  <div className="text-white/30 text-xs">{c.sub}</div>
                </div>
                <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>{c.price}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-4">
            15% off weekly · 25% off monthly · $5 off each additional child
          </p>
        </section>

        {/* ── Free Lesson ── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Free 20-Min Private Lesson
            </h2>
            <p className="text-white/40 text-sm mb-4">By appointment · Before 9 AM or after 4 PM</p>
            <a
              href="tel:+17027887369"
              className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
            >
              📞 Call (702) 788-7369
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
