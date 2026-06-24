import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import AnnouncementBar from '@/components/AnnouncementBar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen text-white pt-16">

        {/* ── Hero Banner ── */}
        <section className="max-w-4xl mx-auto px-4 pt-8">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <Image
              src="/images/basma-banner-hero.jpg"
              alt="B.A.S.M.A. — Become A Singer Music Academy — Where Music Meets Passion"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-3xl mx-auto px-6 pt-10 pb-4 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="gradient-gold">Summer Camp</span>
            <span className="text-white"> 2026</span>
          </h1>
          <p className="text-lg text-white/40 mb-2 max-w-xl mx-auto">
            Music classes for all ages · Mon–Thu · Starting June 29
          </p>
          <p className="text-sm text-white/25 mb-6">
            📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
          </p>
        </section>

        {/* ── 🎉 FREE FIRST WEEK — Big Banner ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <div
            className="rounded-2xl p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.08))',
              border: '2px solid rgba(16,185,129,0.3)',
            }}
          >
            <div className="text-4xl md:text-5xl mb-3">🎉</div>
            <h2
              className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              First Week is FREE!
            </h2>
            <p className="text-white/50 text-sm md:text-base mb-1">
              <strong className="text-emerald-300">June 29 – July 1</strong> — Try any summer camp class at no cost
            </p>
            <p className="text-white/30 text-xs mb-5">
              No payment required · No commitment · Just show up and enjoy!
            </p>
            <Link
              href="/enroll"
              className="inline-block px-10 py-4 rounded-full font-bold text-base transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#0D0118' }}
            >
              Register for Free Week →
            </Link>
          </div>
        </section>

        {/* ── What We Offer — Services Grid ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-6">What We Offer</p>
          <div className="grid sm:grid-cols-3 gap-4">

            {/* Summer Camp */}
            <Link
              href="/enroll"
              className="group rounded-xl p-5 text-center transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">🏕️</div>
              <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Summer Camp</h3>
              <p className="text-white/25 text-xs leading-relaxed">Music classes for all ages. Mon–Thu starting June 29.</p>
              <p className="text-[#c9a84c] text-xs font-semibold mt-2">From $25/day →</p>
            </Link>

            {/* Private Lessons */}
            <Link
              href="/private-lessons"
              className="group rounded-xl p-5 text-center transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Private Lessons</h3>
              <p className="text-white/25 text-xs leading-relaxed">One-on-one instruction. Free 20-min trial lesson included.</p>
              <p className="text-emerald-400 text-xs font-semibold mt-2">Free Trial →</p>
            </Link>

            {/* Marketing / Social Media */}
            <Link
              href="/social-media"
              className="group rounded-xl p-5 text-center transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Social Media Marketing</h3>
              <p className="text-white/25 text-xs leading-relaxed">Grow your brand. Content creation and management.</p>
              <p className="text-[#c9a84c] text-xs font-semibold mt-2">Learn More →</p>
            </Link>

          </div>
        </section>

        {/* ── Summer Camp Classes ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-4">Summer Camp Classes</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: '👶', title: 'Tiny Tots', sub: '5 & Under · 9:00 AM', price: '$25/day' },
              { emoji: '🎵', title: 'Kids Music', sub: '5–17 · 10:00 AM & 11:30 AM', price: 'From $25/day' },
              { emoji: '🎹', title: 'Piano', sub: 'All Ages · 1:30 PM', price: 'From $25/day' },
              { emoji: '🎙️', title: 'Recording', sub: 'All Ages · 2:45 PM', price: 'From $25/day' },
            ].map(c => (
              <Link key={c.title} href="/enroll" className="flex items-center gap-3 p-4 rounded-xl transition hover:scale-[1.02] cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{c.title}</div>
                  <div className="text-white/30 text-xs">{c.sub}</div>
                </div>
                <span className="text-sm font-bold" style={{ color: '#c9a84c' }}>{c.price}</span>
              </Link>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-4">
            🎉 First week FREE · 15% off weekly · 25% off monthly · $5 off each additional child
          </p>
        </section>

        {/* ── Closure Notice ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-red-400/80 text-sm">
              🚫 <strong>School Closed:</strong> Thu June 25 &amp; July 2–6 (No classes)
            </p>
          </div>
        </section>

        {/* ── Free Private Lesson CTA ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Free 20-Min Private Lesson
            </h2>
            <p className="text-white/40 text-sm mb-4">One-on-one instruction · All instruments · By appointment</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/private-lessons"
                className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
              >
                Book Free Trial Online
              </Link>
              <a
                href="tel:+17027887369"
                className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105 border border-white/20 text-white/60 hover:text-white"
              >
                📞 Call (702) 788-7369
              </a>
            </div>
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: '/enroll', label: 'Enroll Now', emoji: '📝' },
              { href: '/private-lessons', label: 'Private Lessons', emoji: '🎵' },
              { href: '/portal', label: 'Parent Portal', emoji: '👨‍👩‍👧' },
              { href: '/contact', label: 'Contact Us', emoji: '💬' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl p-4 text-center transition hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="text-xl mb-1">{link.emoji}</div>
                <div className="text-white/40 text-xs">{link.label}</div>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
