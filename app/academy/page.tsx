export const dynamic = 'force-static'
export const revalidate = 86400

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
    },
  ]

  return (
    <main className="min-h-screen text-white">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
      </div>

      {/* Back nav */}
      <div className="px-8 pt-8">
        <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-300 transition text-sm">
          ← Back to BasmaWorld
        </a>
      </div>

      {/* Hero */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/40 rounded-full px-5 py-2 mb-6 text-sm text-purple-300">
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
        <p className="text-gray-400 max-w-xl mx-auto">
          Whether you&apos;re picking up an instrument for the first time or getting ready to hit the stage — we&apos;ve got a path for you.
        </p>
      </section>

      {/* Paths */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {paths.map((path, i) => (
            <div
              key={path.title}
              className={`card-hover bg-gradient-to-b ${path.bg} border ${path.border} rounded-3xl p-8 text-center`}
            >
              <div className="float text-6xl mb-6" style={{ animationDelay: `${i * 0.8}s` }}>
                {path.emoji}
              </div>
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
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(251,191,36,0.2))', border: '1px solid rgba(168,85,247,0.4)' }}
        >
          <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to begin? 🎶
          </h2>
          <p className="text-gray-300 mb-8">Book a free intro lesson and let&apos;s find your path together.</p>
          <a
            href="/mwl"
            className="pulse-cta inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🎵 Book My Free Lesson
          </a>
        </div>
      </section>

    </main>
  )
}
