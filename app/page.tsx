import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OnlineLessonsComingSoon from '@/components/OnlineLessonsComingSoon'

/* ═══════════════════════════════════════════════════════════════════════════
   PHOTO GALLERY — real photos from BASMA
   ═══════════════════════════════════════════════════════════════════════════ */

const GALLERY_PHOTOS = [
  { src: '/images/camp/kids-piano-duo.jpg', alt: 'Piano instruction at BASMA' },
  { src: '/images/camp/boy-keyboard.jpg', alt: 'Keyboard instruction at BASMA' },
  { src: '/images/camp/classroom-piano-lesson.jpg', alt: 'Private piano lesson at BASMA' },
  { src: '/images/guitar-lesson.jpg', alt: 'Private guitar instruction at BASMA' },
  { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Basma teaching music' },
]


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white" style={{ paddingTop: '64px' }}>

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
                Private lessons · In-person Las Vegas studio or online
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/private-lessons"
                  className="px-10 py-4 rounded-full font-bold text-base transition hover:scale-105 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}
                >
                  Book a Private Lesson →
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

        <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #0D0118 0%, #1a0a2e 50%, #0D0118 100%)' }}>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/60 font-semibold mb-3">One-on-One Instruction</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Private Music Lessons</h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-10">Personalized instruction tailored to your goals in voice, piano, guitar, drums, violin and more.</p>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                ['30-Minute Individual Lesson','$45'],
                ['60-Minute Individual Lesson','$70'],
                ['4 × 30-Minute Monthly Package','$135/month'],
                ['4 × 60-Minute Monthly Package','$200/month'],
              ].map(([name,price]) => (
                <Link key={name} href="/private-lessons" className="rounded-2xl p-6 text-left hover:scale-[1.02] transition" style={{border:'1px solid rgba(201,168,76,0.2)',background:'rgba(255,255,255,0.03)'}}>
                  <h3 className="font-bold text-white mb-3">{name}</h3><p className="text-2xl font-black" style={{color:'#c9a84c'}}>{price}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 pb-4">
            <OnlineLessonsComingSoon />
          </div>
        </section>

        <section className="py-16 px-6" style={{ background: '#0D0118' }}>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/60 font-semibold mb-3">See What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Life at <span style={{color:'#c9a84c'}}>BASMA</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GALLERY_PHOTOS.map((photo,i)=><div key={i} className="relative rounded-xl overflow-hidden" style={{aspectRatio:'1/1'}}><Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 250px"/></div>)}
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
              <Link href="/private-lessons" className="px-10 py-4 rounded-full font-bold text-base transition hover:scale-105" style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}>
                Book a Private Lesson
              </Link>
              <Link href="/private-lessons" className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105 border border-white/20 text-white/60 hover:text-white">
                Book Private Lessons
              </Link>
              <a href="tel:+17027887369" className="px-8 py-4 rounded-full font-semibold text-sm transition hover:scale-105 border border-white/20 text-white/60 hover:text-white">
                📞 (702) 788-7369
              </a>
            </div>
            <p className="text-white/30 text-sm">
              📍 6787 W Tropicana Ave, Suite 260, Las Vegas, NV 89103
            </p>
            <p className="text-white/20 text-xs mt-1">
              Private lessons available in person or online
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
