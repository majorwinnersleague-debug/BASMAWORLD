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

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/basma/basma-teaching-classroom-2.jpg"
          alt="Students in Basma Music Academy classroom"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 mb-6 text-sm text-white/50 backdrop-blur-sm">
            All ages &amp; skill levels welcome
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">BASMA </span>
            <span className="gradient-gold">Music Academy</span>
          </h1>
          <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto leading-relaxed">
            Level up your music skills. Earn XP. Unlock your full potential.
          </p>
          <p className="text-white/40 max-w-xl mx-auto">
            Whether you&apos;re picking up an instrument for the first time or getting ready to hit the stage — we&apos;ve got a path for you.
          </p>
        </div>
      </section>

      {/* Back nav */}
      <div className="absolute top-0 left-0 px-8 pt-8 z-20">
        <a href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#c9a84c] transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
          ← Back to BasmaWorld
        </a>
      </div>

      {/* ── Learning Paths ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Choose Your Path
        </h2>
        <div className="divider mx-auto mb-4" />
        <p className="text-white/40 text-center mb-14 max-w-lg mx-auto">
          Three tracks designed to take you from wherever you are to wherever you want to be.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {paths.map((path) => (
            <div
              key={path.title}
              className="card-premium bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              {/* Photo header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={path.image}
                  alt={path.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {path.title}
                </h3>
                <p className="text-white/50 leading-relaxed mb-6">{path.desc}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {path.tags.map(tag => (
                    <span key={tag} className="bg-white/[0.06] text-white/50 rounded-full px-3 py-1 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quest Board ────────────────────────────────────────────────────── */}
      <QuestBoard />

      {/* ── XP Leaderboard ─────────────────────────────────────────────────── */}
      <XPLeaderboard />

      {/* ── Photo Gallery ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
          Life at the Academy
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl ${
                i === 0 || i === 3 ? 'row-span-2 h-80' : 'h-40'
              } group`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="glass-gold rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Begin?
          </h2>
          <p className="text-white/50 mb-8">Book a free intro lesson and let&apos;s find your path together.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/mwl"
              className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg"
            >
              Book My Free Lesson
            </a>
            <a
              href="/game"
              className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white/70 hover:text-white transition"
            >
              Play MajorWinners
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
