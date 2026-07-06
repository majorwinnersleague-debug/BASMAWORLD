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
            <span className="gradient-gold">BASMA Academy</span>
            <span className="text-white"> 2026</span>
          </h1>
          <p className="text-lg text-white/40 mb-2 max-w-xl mx-auto">
            Music classes for all ages · Mon–Thu · 9:00 AM – 2:15 PM
          </p>
          <p className="text-sm text-white/25 mb-6">
            📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
          </p>
        </section>

        {/* ── 🎓 Scholarship Banner ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <Link href="/scholarship">
            <div
              className="rounded-2xl p-6 md:p-8 text-center relative overflow-hidden cursor-pointer transition hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.08))',
                border: '2px solid rgba(168,85,247,0.3)',
              }}
            >
              <div className="text-4xl md:text-5xl mb-3">🎓</div>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                BASMA World Scholarship
              </h2>
              <p className="text-white/50 text-sm md:text-base mb-1">
                <strong className="text-purple-300">$250/month</strong> — 1 hour of classes daily for your entire family
              </p>
              <p className="text-white/30 text-xs mb-5">Summer only (July & August) · Priority for June families · Limited spots</p>
              <span
                className="inline-block px-10 py-4 rounded-full font-bold text-base transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
              >
                Learn More →
              </span>
            </div>
          </Link>
        </section>

        {/* ── What We Offer — Services Grid ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-6">What We Offer</p>
          <div className="grid sm:grid-cols-3 gap-4">

            {/* BASMA Academy */}
            <Link
              href="/enroll"
              className="group rounded-xl overflow-hidden transition hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                <Image src="/images/camp/summer-camp-bubbles.jpg" alt="Kids having fun at BASMA Academy with instruments" fill className="object-cover object-[center_30%]" style={{ objectPosition: 'center 70%' }} sizes="300px" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-[#c9a84c] transition-colors">BASMA Academy</h3>
                <p className="text-white/25 text-xs leading-relaxed">Tiny Tots, Kids Music, Band Academy, Piano & more! Mon–Thu. All ages welcome.</p>
                <p className="text-[#c9a84c] text-xs font-semibold mt-2">Enroll Now →</p>
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
                <p className="text-white/25 text-xs leading-relaxed">One-on-one instruction tailored to your goals. Pay online instantly!</p>
                <p className="text-[#c9a84c] text-xs font-semibold mt-2">From $35/session →</p>
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

        {/* ── BASMA Academy Programs ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] text-center mb-4">Weekly Programs · Mon–Thu</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                emoji: '👶', title: 'Tiny Tots Music & Movement', sub: 'Ages 5 & Under · 9:00–9:45 AM', duration: '45 min',
                desc: 'An engaging introduction to music through singing, movement, rhythm, storytelling, instruments, and creative play.',
                img: '/images/camp/little-girl-piano.jpg',
              },
              {
                emoji: '🎵', title: 'Kids Music Academy', sub: 'By Skill Level · 10:00–11:15 AM', duration: '1h 15min',
                desc: 'Students build musical skills through singing, rhythm, movement, music theory, and instrument exploration while learning songs based on the monthly theme.',
                img: '/images/camp/kids-guitar-class.jpg',
              },
              {
                emoji: '🎸', title: 'Band Academy', sub: 'By Skill Level · 1:00–2:15 PM', duration: '1h 15min',
                desc: 'Students develop ensemble skills on their instrument of choice — piano, guitar, drums, violin, voice, ukulele, bass, and more.',
                img: '/images/camp/kids-guitar-drums.jpg',
              },
              {
                emoji: '🎹', title: 'Piano Fundamentals', sub: 'By Skill Level · 45 min', duration: '45 min',
                desc: 'Focused piano instruction covering note reading, technique, rhythm, ear training, and performance skills.',
                img: '/images/camp/kids-piano-duo.jpg',
              },
            ].map(c => (
              <Link key={c.title + c.sub} href="/enroll" className="group flex gap-4 p-4 rounded-xl transition hover:scale-[1.02] cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                  <Image src={c.img} alt={c.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-white text-sm group-hover:text-[#c9a84c] transition-colors">{c.emoji} {c.title}</div>
                    <span className="text-xs font-bold text-[#c9a84c] flex-shrink-0">{c.duration}</span>
                  </div>
                  <div className="text-white/30 text-xs mb-1">{c.sub}</div>
                  <p className="text-white/20 text-[11px] leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-4">
            🎓 Scholarship available · Multiple session times · Monthly themes for all classes
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

        {/* ── Schedule Info ── */}
        <section className="max-w-3xl mx-auto px-6 pb-6">
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <p className="text-purple-300/80 text-sm">
              📅 <strong>Classes run Monday–Thursday</strong> · 9:00 AM – 2:15 PM · Check the calendar for closures &amp; holidays
            </p>
          </div>
        </section>

        {/* ── Private Lessons CTA ── */}
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
                  Private Music Lessons
                </h2>
                <p className="text-white/40 text-sm mb-4">
                  One-on-one instruction on any instrument. Tailored to your goals — pay online and get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link
                    href="/private-lessons"
                    className="inline-block px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
                  >
                    View Lesson Packages
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
