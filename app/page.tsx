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
      <main className="min-h-screen text-white" style={{ paddingTop: 'calc(var(--ann-bar-height, 0px) + 64px)' }}>

        {/* ══════════════════════════════════════════════════════════
            HERO — Banner + CTA
            ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0D0118 100%)' }}>
          {/* Ambient glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #c9a84c, transparent)' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16">
            {/* Banner Image */}
            <div className="relative w-full max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl" style={{ border: '2px solid rgba(201,168,76,0.3)', aspectRatio: '16/9' }}>
              <Image
                src="/images/basma-banner-hero.jpg"
                alt="B.A.S.M.A. — Become A Singer Music Academy — Where Music Meets Passion"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>

            {/* Hero Text */}
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300/70 font-semibold mb-4">
                Become a Singer Music Academy
              </p>
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span style={{ color: '#c9a84c' }}>B.A.S.M.A.</span>{' '}
                <span className="text-white">Academy</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto mb-2 italic">
                Find Your Voice. Build Confidence. Perform on Stage.
              </p>
              <p className="text-white/30 text-sm mb-8">
                Mon–Thu · 9:00 AM – 2:15 PM · Synergy Dance, Las Vegas, NV
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/enroll"
                  className="px-10 py-4 rounded-full font-bold text-base transition hover:scale-105 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}
                >
                  Enroll Now →
                </Link>
                <Link
                  href="/scholarship"
                  className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105"
                  style={{ background: 'rgba(168,85,247,0.2)', border: '2px solid rgba(168,85,247,0.5)', color: '#d8b4fe' }}
                >
                  🎓 Scholarship — $250/mo
                </Link>
                <a
                  href="tel:+17027887369"
                  className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                >
                  📞 (702) 788-7369
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PROGRAMS — Visual cards with large images
            ══════════════════════════════════════════════════════════ */}
        <section className="relative py-20 px-6" style={{ background: 'linear-gradient(180deg, #0D0118 0%, #1a0a2e 50%, #0D0118 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/60 font-semibold mb-3">Weekly Programs · Monday – Thursday</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our <span style={{ color: '#c9a84c' }}>Academy</span> Programs
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  emoji: '👶', title: 'Tiny Tots Music & Movement', time: '9:00 – 9:45 AM', placement: 'Ages 5 & Under', duration: '45 min',
                  desc: 'An engaging introduction to music through singing, movement, rhythm, storytelling, instruments, and creative play.',
                  img: '/images/camp/little-girl-piano.jpg', gradient: 'from-pink-500/20 to-purple-500/10',
                },
                {
                  emoji: '🎵', title: 'Kids Music Academy', time: '10:00 – 11:15 AM & 11:30 – 12:45 PM', placement: 'By Skill Level', duration: '1h 15min',
                  desc: 'Students build musical skills through singing, rhythm, movement, music theory, and instrument exploration. Two sessions available.',
                  img: '/images/camp/kids-guitar-class.jpg', gradient: 'from-blue-500/20 to-purple-500/10',
                },
                {
                  emoji: '🎸', title: 'Band Academy', time: '1:00 – 2:15 PM', placement: 'By Skill Level', duration: '1h 15min',
                  desc: 'Ensemble skills on your instrument of choice — piano, guitar, drums, violin, voice, ukulele, bass, and more.',
                  img: '/images/camp/kids-guitar-drums.jpg', gradient: 'from-green-500/20 to-teal-500/10',
                },
                {
                  emoji: '🎹', title: 'Piano Fundamentals', time: 'Scheduled by Level', placement: 'By Skill Level', duration: '45 min',
                  desc: 'Focused piano instruction covering note reading, technique, rhythm, ear training, and performance skills.',
                  img: '/images/camp/kids-piano-duo.jpg', gradient: 'from-yellow-500/20 to-orange-500/10',
                },
              ].map(c => (
                <Link key={c.title} href="/enroll" className={`group relative rounded-2xl overflow-hidden transition hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br ${c.gradient}`} style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    <Image src={c.img} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 500px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(201,168,76,0.9)', color: '#0D0118' }}>
                      {c.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{c.emoji}</span>
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{c.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c' }}>{c.time}</span>
                      <span className="text-xs text-white/40">{c.placement}</span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/enroll"
                className="inline-block px-10 py-4 rounded-full font-bold text-base transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
              >
                Enroll in a Program →
              </Link>
              <p className="text-white/25 text-xs mt-3">
                Monthly themes for all classes · Weekly progress reports · Performances year-round
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SCHOLARSHIP — Bold banner
            ══════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2a1050 50%, #1a0533 100%)' }}>
          <div className="max-w-4xl mx-auto">
            <Link href="/scholarship" className="block group">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-400 font-semibold mb-3">🎓 Family Scholarship</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span className="text-purple-300">$250/month</span> for Your Entire Family
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed mb-6">
                    One flat rate covers every child in your family. Choose from any program — Tiny Tots, Kids Music, Band Academy, or Piano. Classes Monday through Thursday.
                  </p>
                  <span
                    className="inline-block px-8 py-3 rounded-full font-bold text-sm transition group-hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff' }}
                  >
                    Learn More About Scholarship →
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                  <Image src="/images/camp/group-music-class.jpg" alt="Group music class at BASMA" fill className="object-cover" sizes="500px" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.2))' }} />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PHOTO GALLERY
            ══════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6" style={{ background: '#0D0118' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/60 font-semibold mb-3">See What We Do</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Life at <span style={{ color: '#c9a84c' }}>BASMA</span>
              </h2>
            </div>
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
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 250px"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            PRIVATE LESSONS + SERVICES
            ══════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #0D0118 0%, #1a0a2e 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Private Lessons */}
              <Link href="/private-lessons" className="group relative rounded-2xl overflow-hidden transition hover:scale-[1.02]" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
                <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                  <Image src="/images/camp/boy-keyboard.jpg" alt="Private keyboard lesson" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="500px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-widest text-yellow-300/70 font-semibold mb-2">One-on-One Instruction</p>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Private Music Lessons</h3>
                  <p className="text-white/50 text-sm mb-3">Piano, voice, guitar, drums, violin & more. Tailored to your goals.</p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}>
                      From $35/session
                    </span>
                    <span className="text-white/40 text-xs">4-pack available</span>
                  </div>
                </div>
              </Link>

              {/* Marketing Services */}
              <Link href="/social-media" className="group relative rounded-2xl overflow-hidden transition hover:scale-[1.02]" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                  <Image src="/images/basma/basma-editing-studio.jpg" alt="Content creation studio" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="500px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-widest text-purple-300/70 font-semibold mb-2">Major Winners Marketing</p>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Social Media Services</h3>
                  <p className="text-white/50 text-sm mb-3">Professional content creation, brand growth, and social media management.</p>
                  <span className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(168,85,247,0.3)', border: '1px solid rgba(168,85,247,0.5)', color: '#d8b4fe' }}>
                    Learn More →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CONTACT + LOCATION
            ══════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6" style={{ background: '#0D0118' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Start Your Musical Journey?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/enroll" className="px-10 py-4 rounded-full font-bold text-base transition hover:scale-105" style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}>
                Enroll Now
              </Link>
              <Link href="/private-lessons" className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105 border border-white/20 text-white/60 hover:text-white">
                Book Private Lessons
              </Link>
              <a href="tel:+17027887369" className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105 border border-white/20 text-white/60 hover:text-white">
                📞 (702) 788-7369
              </a>
            </div>
            <p className="text-white/30 text-sm">
              📍 Synergy Dance · 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147
            </p>
            <p className="text-white/20 text-xs mt-1">
              Classes Mon–Thu · 9:00 AM – 2:15 PM · All ages welcome
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
