import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import AnnouncementBar from '@/components/AnnouncementBar'
import Footer from '@/components/Footer'

/* ═══════════════════════════════════════════════════════════════════════════
   PHOTO GALLERY — real photos from BASMA
   ═══════════════════════════════════════════════════════════════════════════ */

const GALLERY_PHOTOS = [
  { src: '/images/camp/kids-piano-duo.jpg', alt: 'Two young students smiling at the piano' },
  { src: '/images/camp/students-guitar-duo.jpg', alt: 'Students learning guitar together' },
  { src: '/images/camp/boy-keyboard.jpg', alt: 'Boy focused on keyboard practice' },
  { src: '/images/camp/teacher-whiteboard.jpg', alt: 'Instructor teaching music theory at whiteboard' },
  { src: '/images/camp/little-girl-piano.jpg', alt: 'Little girl playing the keyboard' },
  { src: '/images/camp/kids-guitar-class.jpg', alt: 'Kids with guitars in a group class' },
  { src: '/images/camp/group-music-class.jpg', alt: 'Full group music class in session' },
  { src: '/images/camp/classroom-piano-lesson.jpg', alt: 'Piano lesson in the BASMA studio' },
  { src: '/images/camp/kids-guitar-drums.jpg', alt: 'Kids playing guitars and drums together' },
  { src: '/images/guitar-lesson.jpg', alt: 'Guitar instruction at BASMA' },
  { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Basma teaching in the classroom' },
  { src: '/images/camp/guitar-promo.jpg', alt: 'Learn guitar at BASMA Music Academy' },
]

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
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              First Week is FREE!
            </h2>
            <p className="text-white/50 text-sm md:text-base mb-1">
              <strong className="text-emerald-300">June 29 – July 1</strong> — Try any summer camp class at no cost
            </p>
            <p className="text-white/30 text-xs mb-5">No payment required · No commitment · Just show up and enjoy!</p>
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
              className="group rounded-xl overflow-hidden transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                <Image src="/images/camp/summer-camp-bubbles.jpg" alt="Kids having fun at BASMA summer camp with bubbles and instruments" fill className="object-cover object-top" sizes="300px" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Summer Camp</h3>
                <p className="text-white/25 text-xs leading-relaxed">Guitar, drums, piano, voice & more! Mon–Thu starting June 29. All ages welcome.</p>
                <p className="text-[#c9a84c] text-xs font-semibold mt-2">From $25/day →</p>
              </div>
            </Link>

            {/* Private Lessons */}
            <Link
              href="/private-lessons"
              className="group rounded-xl overflow-hidden transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                <Image src="/images/camp/kids-piano-duo.jpg" alt="Two students smiling during a private piano lesson" fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Private Lessons</h3>
                <p className="text-white/25 text-xs leading-relaxed">One-on-one instruction tailored to your goals. Free 20-min trial included!</p>
                <p className="text-emerald-400 text-xs font-semibold mt-2">Free Trial →</p>
              </div>
            </Link>

            {/* Marketing / Social Media */}
            <Link
              href="/social-media"
              className="group rounded-xl overflow-hidden transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                <Image src="/images/basma/basma-editing-studio.jpg" alt="Social media content creation" fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">Social Media Marketing</h3>
                <p className="text-white/25 text-xs leading-relaxed">Grow your brand with professional content creation and management.</p>
                <p className="text-[#c9a84c] text-xs font-semibold mt-2">Learn More →</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Summer Camp Classes — Updated Descriptions ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-4">Summer Camp Classes</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                emoji: '👶', title: 'Tiny Tots', sub: '5 & Under · 9:00 AM', price: '$25/day',
                desc: 'A magical first step into music! Shake, clap, sing, and explore real instruments through fun and games.',
                img: '/images/camp/little-girl-piano.jpg',
              },
              {
                emoji: '🎵', title: 'Kids Music', sub: '5–17 · 10:00 AM & 11:30 AM', price: 'From $25/day',
                desc: 'Play guitar, drums, piano & more with friends! Jam together, write songs, and have the best summer ever.',
                img: '/images/camp/kids-guitar-class.jpg',
              },
              {
                emoji: '🎹', title: 'Piano', sub: 'All Ages · 1:30 PM', price: 'From $25/day',
                desc: 'From first chords to favorite songs — learn technique, theory, and how to perform with confidence!',
                img: '/images/camp/kids-piano-duo.jpg',
              },
              {
                emoji: '🎙️', title: 'Recording', sub: 'All Ages · 2:45 PM', price: 'From $25/day',
                desc: 'Become a real recording artist! Use a mic, record tracks, edit music, and build your artist image.',
                img: '/images/studio-session.jpg',
              },
            ].map(c => (
              <Link key={c.title + c.sub} href="/enroll" className="group flex gap-4 p-4 rounded-xl transition hover:scale-[1.02] cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                  <Image src={c.img} alt={c.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-white text-sm group-hover:text-[#c9a84c] transition-colors">{c.emoji} {c.title}</div>
                    <span className="text-xs font-bold text-[#c9a84c] flex-shrink-0">{c.price}</span>
                  </div>
                  <div className="text-white/30 text-xs mb-1">{c.sub}</div>
                  <p className="text-white/20 text-[11px] leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-4">
            🎉 First week FREE · 15% off weekly · 25% off monthly · $5 off each additional child
          </p>
        </section>

        {/* ── Photo Gallery ── */}
        <section className="max-w-4xl mx-auto px-6 pb-8">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-6">Life at BASMA</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_PHOTOS.slice(0, 8).map((photo, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden shadow-lg group"
                style={{ aspectRatio: i === 0 || i === 3 ? '4/5' : '1/1' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 250px"
                />
              </div>
            ))}
          </div>
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
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <div className="grid md:grid-cols-2">
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="/images/camp/boy-keyboard.jpg"
                  alt="Student enjoying a private keyboard lesson"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center text-center md:text-left" style={{ background: 'rgba(201,168,76,0.06)' }}>
                <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Free 20-Min Private Lesson
                </h2>
                <p className="text-white/40 text-sm mb-4">
                  One-on-one instruction on any instrument. Meet your teacher, try it out — no strings attached.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
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
                    📞 (702) 788-7369
                  </a>
                </div>
              </div>
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
