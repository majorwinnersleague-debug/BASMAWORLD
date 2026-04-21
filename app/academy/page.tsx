import Image from 'next/image'
import XPLeaderboard from '@/components/XPLeaderboard'
import QuestBoard from '@/components/QuestBoard'

export const dynamic = 'force-dynamic'

export default function Academy() {
  const paths = [
    {
      title: 'Music Path',
      desc: 'Guitar, piano, vocals, theory — from absolute beginner to stage-ready performer.',
      tags: ['Guitar', 'Piano', 'Vocals', 'Theory'],
      image: '/images/basma/basma-teaching-classroom.jpg',
      imageAlt: 'Basma teaching music in classroom',
    },
    {
      title: 'Branding Path',
      desc: 'Build your artist brand, master social media, and turn followers into fans.',
      tags: ['Social Media', 'Content', 'Identity', 'Marketing'],
      image: '/images/marketing/basma-ig-academy.jpg',
      imageAlt: 'Basma academy social media content',
    },
    {
      title: 'Wellness Path',
      desc: 'Artist wellness, performance mindset, and sustainable creative habits.',
      tags: ['Mindset', 'Performance', 'Wellness', 'Habits'],
      image: '/images/basma/basma-community-daytime.jpg',
      imageAlt: 'Community wellness and mindset session',
    },
  ]

  const galleryImages = [
    { src: '/images/basma/basma-broadway-kids-academy.jpg', alt: 'Broadway kids academy class' },
    { src: '/images/basma/basma-orchestra.jpg', alt: 'Student orchestra performing' },
    { src: '/images/studio/pianist-spotlight.jpg', alt: 'Pianist in the spotlight' },
    { src: '/images/basma/students-recital-performance.jpg', alt: 'Students recital performance' },
    { src: '/images/basma/basma-with-student.jpg', alt: 'Basma with student one-on-one' },
    { src: '/images/studio/studio-whiteboard-notes.jpg', alt: 'Music theory on whiteboard' },
  ]

  return (
    <main className="min-h-screen text-white">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/basma/basma-teaching-classroom-2.jpg"
          alt="Students in Basma Music Academy classroom"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-6">All ages & skill levels</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">BASMA </span>
            <span className="gradient-gold">Music Academy</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Level up your music skills. Earn XP. Unlock your full potential.
          </p>
        </div>
      </section>

      {/* Back nav */}
      <div className="absolute top-0 left-0 px-8 pt-8 z-20">
        <a href="/" className="text-white/40 hover:text-[#c9a84c] transition text-sm">
          ← Back
        </a>
      </div>

      {/* ── Learning Paths ───────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Choose Your <span className="gradient-gold">Path</span>
        </h2>
        <p className="text-white/30 text-center mb-12 text-sm max-w-md mx-auto">
          Three tracks designed to take you from wherever you are to wherever you want to be.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {paths.map((path) => (
            <div key={path.title} className="card-minimal rounded-xl overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={path.image}
                  alt={path.imageAlt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {path.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed mb-4">{path.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {path.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quest Board ──────────────────────────────── */}
      <QuestBoard />

      {/* ── XP Leaderboard ───────────────────────────── */}
      <XPLeaderboard />

      {/* ── Photo Gallery ────────────────────────────── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-white text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Life at the <span className="gradient-gold">Academy</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl ${
                i === 0 || i === 3 ? 'row-span-2 h-72' : 'h-36'
              }`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>
      </section>

      <div className="divider max-w-3xl mx-auto" />

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Ready to <span className="gradient-gold">Begin</span>?
        </h2>
        <p className="text-white/30 mb-8 text-sm">Book a free intro lesson and find your path.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/mwl" className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-wide">
            Book My Free Lesson
          </a>
          <a href="/game" className="btn-outline px-8 py-3.5 rounded-full text-sm tracking-wide">
            Play MajorWinners
          </a>
        </div>
      </section>

    </main>
  )
}
