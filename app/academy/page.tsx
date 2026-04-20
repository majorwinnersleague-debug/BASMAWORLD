import Image from 'next/image'
import XPLeaderboard from '@/components/XPLeaderboard'
import QuestBoard from '@/components/QuestBoard'

export const dynamic = 'force-dynamic'

export default function Academy() {
  const paths = [
    {
      emoji: '🎸',
      title: 'Music Path',
      color: 'purple',
      border: 'border-purple-500/40',
      bg: 'from-purple-900/50 to-purple-950/30',
      badge: 'bg-purple-500/20 text-purple-300',
      desc: 'Guitar, piano, vocals, theory — from absolute beginner to stage-ready performer.',
      tags: ['Guitar', 'Piano', 'Vocals', 'Theory'],
      image: '/images/basma/basma-teaching-classroom.jpg',
      imageAlt: 'Basma teaching music in classroom',
    },
    {
      emoji: '🎨',
      title: 'Branding Path',
      color: 'yellow',
      border: 'border-yellow-500/40',
      bg: 'from-yellow-900/40 to-amber-950/20',
      badge: 'bg-yellow-500/20 text-yellow-300',
      desc: 'Build your artist brand, master social media, and turn followers into fans.',
      tags: ['Social Media', 'Content', 'Identity', 'Marketing'],
      image: '/images/marketing/basma-ig-academy.jpg',
      imageAlt: 'Basma academy social media content',
    },
    {
      emoji: '💚',
      title: 'Wellness Path',
      color: 'emerald',
      border: 'border-emerald-500/40',
      bg: 'from-emerald-900/40 to-green-950/20',
      badge: 'bg-emerald-500/20 text-emerald-300',
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

      {/* ── Hero with background image ─────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/basma/basma-teaching-classroom-2.jpg"
          alt="Students in Basma Music Academy classroom"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-500/40 rounded-full px-5 py-2 mb-6 text-sm text-purple-300 backdrop-blur-sm">
            🎓 All ages & skill levels welcome
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-white">BASMA </span>
            <span style={{ background: 'linear-gradient(135deg, #c084fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Music Academy
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-4 max-w-2xl mx-auto leading-relaxed">
            Level up your music skills. Earn XP. Unlock your full potential. 🚀
          </p>
          <p className="text-white/60 max-w-xl mx-auto">
            Whether you&apos;re picking up an instrument for the first time or getting ready to hit the stage — we&apos;ve got a path for you.
          </p>
        </div>
      </section>

      {/* Back nav (floating) */}
      <div className="absolute top-0 left-0 px-8 pt-8 z-20">
        <a href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-purple-300 transition text-sm backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
          ← Back to BasmaWorld
        </a>
      </div>

      {/* ── Learning Paths with photos ─────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Choose Your Path
        </h2>
        <p className="text-white/40 text-center mb-12 max-w-lg mx-auto">
          Three tracks designed to take you from wherever you are to wherever you want to be.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {paths.map((path, i) => (
            <div
              key={path.title}
              className={`card-hover bg-gradient-to-b ${path.bg} border ${path.border} rounded-3xl overflow-hidden`}
            >
              {/* Photo header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={path.image}
                  alt={path.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-3xl" style={{ animationDelay: `${i * 0.8}s` }}>
                    {path.emoji}
                  </span>
                </div>
              </div>

              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">{path.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{path.desc}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {path.tags.map(tag => (
                    <span key={tag} className={`${path.badge} rounded-full px-3 py-1 text-xs font-medium`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quest Board (NEW) ──────────────────────────────────────────────── */}
      <QuestBoard />

      {/* ── XP Leaderboard (NEW) ───────────────────────────────────────────── */}
      <XPLeaderboard />

      {/* ── Photo Gallery ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Life at the Academy 📸
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
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(251,191,36,0.2))', border: '1px solid rgba(168,85,247,0.4)' }}
        >
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to begin? 🎶
          </h2>
          <p className="text-gray-300 mb-8">Book a free intro lesson and let&apos;s find your path together.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/mwl"
              className="pulse-cta inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              🎵 Book My Free Lesson
            </a>
            <a
              href="/game"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            >
              🎮 Play MajorWinners
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
