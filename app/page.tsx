import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-hidden">

      {/* ── Decorative background blobs ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute top-[30%] right-[-8%] w-80 h-80 rounded-full opacity-15 blur-3xl"
             style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
      </div>

      {/* ── Hero with background image ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Hero background */}
        <div className="absolute inset-0 -z-[5]">
          <Image
            src="/images/basma/basma-performing-stage-1.jpg"
            alt="Basma performing live on stage"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/40 rounded-full px-5 py-2 mb-8 text-sm font-medium text-purple-300 shimmer backdrop-blur-sm">
          ✨ Music · Community · Opportunity
        </div>

        {/* Headline */}
        <h1
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="gradient-text">Basma</span>
          <span className="text-white">World</span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-200 mb-4 max-w-2xl leading-relaxed">
          Where artists <strong className="text-yellow-400">level up</strong>, communities <strong className="text-green-400">thrive</strong>, and dreams become <strong className="text-purple-400">reality</strong>.
        </p>
        <p className="text-base text-gray-400 mb-12 max-w-xl">
          Join thousands of students, creators & changemakers building their best life through music and community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/academy"
            className="pulse-cta inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🎵 Start Your Music Journey
          </a>
          <a
            href="/mwl"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 glow-gold"
          >
            🏆 Grow Your Brand
          </a>
          <a
            href="/hopes"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          >
            🤝 Get Support
          </a>
        </div>

        {/* Social proof strip */}
        <div className="flex flex-wrap gap-6 justify-center mt-16 text-sm text-gray-400">
          <span className="flex items-center gap-2"><span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span> 500+ students</span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">🎉 <span>Las Vegas & Online</span></span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-2">🎵 <span>All ages welcome</span></span>
        </div>
      </section>

      {/* ── Photo strip ── */}
      <section className="py-4 overflow-hidden">
        <div className="flex gap-4 animate-[scroll_30s_linear_infinite] w-max">
          {[
            { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Live music performance' },
            { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Basma teaching music class' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community gathering outdoors' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Students performing at recital' },
            { src: '/images/basma/basma-dance-crew-gym.jpg', alt: 'Dance crew rehearsal' },
            { src: '/images/basma/basma-broadway-kids-academy.jpg', alt: 'Broadway kids academy' },
            { src: '/images/basma/basma-community-event.jpg', alt: 'Community event at night' },
            { src: '/images/basma/basma-with-student.jpg', alt: 'Basma with film clapperboard' },
            { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Live music performance' },
            { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Basma teaching music class' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community gathering outdoors' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Students performing at recital' },
          ].map((img, i) => (
            <div key={i} className="relative w-64 h-44 flex-shrink-0 rounded-2xl overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="256px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── What is BasmaWorld ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Three Worlds. <span className="gradient-text">One Community.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to level up your artistry, grow your brand, and find real support.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Academy Card */}
          <a href="/academy" className="card-hover group block bg-gradient-to-b from-purple-900/50 to-purple-950/30 border border-purple-500/30 rounded-3xl overflow-hidden hover:border-purple-400/60">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/basma/basma-teaching-classroom.jpg"
                alt="Basma teaching a music class"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 to-transparent" />
              <div className="absolute bottom-3 left-4 text-4xl">🎵</div>
            </div>
            <div className="p-6 pt-4 text-center">
              <h3 className="text-2xl font-bold text-purple-300 mb-3">Music Academy</h3>
              <p className="text-gray-400 leading-relaxed mb-4">Master your instrument, build a killer brand, and perform with confidence. Lessons for all levels.</p>
              <span className="inline-block bg-purple-500/20 text-purple-300 rounded-full px-4 py-1 text-sm font-medium">
                Start Learning →
              </span>
            </div>
          </a>

          {/* MWL Card */}
          <a href="/mwl" className="card-hover group block bg-gradient-to-b from-yellow-900/40 to-amber-950/20 border border-yellow-500/30 rounded-3xl overflow-hidden hover:border-yellow-400/60">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/basma/basma-with-student.jpg"
                alt="Basma with film clapperboard — content creation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 to-transparent" />
              <div className="absolute bottom-3 left-4 text-4xl">🏆</div>
            </div>
            <div className="p-6 pt-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-300 mb-3">Major Winners League</h3>
              <p className="text-gray-400 leading-relaxed mb-4">Content creation, music marketing, and brand strategy that gets real results. Let&apos;s grow.</p>
              <span className="inline-block bg-yellow-500/20 text-yellow-300 rounded-full px-4 py-1 text-sm font-medium">
                Work With Us →
              </span>
            </div>
          </a>

          {/* Hopes Card */}
          <a href="/hopes" className="card-hover group block bg-gradient-to-b from-emerald-900/40 to-green-950/20 border border-emerald-500/30 rounded-3xl overflow-hidden hover:border-emerald-400/60">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/basma/basma-community-event.jpg"
                alt="BasmaWorld community gathering"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 to-transparent" />
              <div className="absolute bottom-3 left-4 text-4xl">🤝</div>
            </div>
            <div className="p-6 pt-4 text-center">
              <h3 className="text-2xl font-bold text-emerald-300 mb-3">Hopes Chance</h3>
              <p className="text-gray-400 leading-relaxed mb-4">Free, confidential resources for housing, jobs, mental health & more. No judgment. Just help.</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 rounded-full px-4 py-1 text-sm font-medium">
                Find Resources →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Gallery grid ── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The <span className="gradient-text">BasmaWorld</span> Experience
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">From stage performances to community events — see what makes us different.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: '/images/basma/basma-performing-stage-1.jpg', alt: 'Live stage performance', span: 'md:col-span-2 md:row-span-2' },
            { src: '/images/basma/basma-orchestra.jpg', alt: 'Orchestra performance' },
            { src: '/images/basma/basma-editing-studio.jpg', alt: 'Editing studio session' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community backyard gathering', span: 'md:col-span-2' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Student recital' },
            { src: '/images/basma/basma-performing-stage-2.jpg', alt: 'On stage performing' },
          ].map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl ${img.span ?? ''} ${
                img.span?.includes('row-span-2') ? 'h-64 md:h-full min-h-[16rem]' : 'h-48 md:h-56'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes={img.span?.includes('col-span-2') ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Billy Bob the Puppet CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-purple-900/30 to-yellow-900/20 border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden">
            <Image
              src="/images/basma-hero.jpg"
              alt="Boddee Billy Bob — BasmaWorld mascot"
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Meet <span className="text-yellow-400">Boddee Billy Bob</span> 🧡
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Our orange, fuzzy, slightly unhinged mascot. He&apos;s part puppet, part hype man, and 100% the heart of BasmaWorld. If he believes in you, that&apos;s all you need.
            </p>
            <a
              href="/academy"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Join the Family →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-12 px-6 border-t border-white/5">
        <p className="text-2xl font-bold gradient-text mb-2">BasmaWorld 🌍</p>
        <p className="text-gray-500 text-sm">Built with love in Las Vegas · Music · Community · Opportunity</p>
        <p className="text-gray-600 text-xs mt-3">© {new Date().getFullYear()} BasmaWorld. All rights reserved.</p>
      </footer>

    </main>
  )
}
