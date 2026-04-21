import Image from 'next/image'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/basma/basma-performing-stage-1.jpg"
            alt="Live performance"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Basma</span>
            <span className="text-white">World</span>
          </h1>

          <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
            Music education, community, and real opportunity — all under one roof.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/academy" className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-wide">
              Start Learning
            </a>
            <a href="/game" className="btn-outline px-8 py-3.5 rounded-full text-sm tracking-wide">
              Play MajorWinners
            </a>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase text-center mb-4">The Ecosystem</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Three Worlds. <span className="gradient-gold">One Vision.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <a href="/academy" className="group card-minimal rounded-xl overflow-hidden">
            <div className="relative h-52 overflow-hidden">
              <Image
                src="/images/basma/basma-teaching-classroom.jpg"
                alt="Music Academy"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-[11px] text-[#c9a84c] tracking-widest uppercase mb-2">Music Academy</p>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Master Your Instrument
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">
                Vocals, piano, guitar, and music theory with gamified XP progression.
              </p>
            </div>
          </a>

          <a href="/mwl" className="group card-minimal rounded-xl overflow-hidden">
            <div className="relative h-52 overflow-hidden">
              <Image
                src="/images/basma/basma-with-student.jpg"
                alt="Brand Strategy"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-[11px] text-[#c9a84c] tracking-widest uppercase mb-2">Major Winners League</p>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Grow Your Brand
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">
                Content creation, music marketing, and brand strategy with real results.
              </p>
            </div>
          </a>

          <a href="/hopes" className="group card-minimal rounded-xl overflow-hidden">
            <div className="relative h-52 overflow-hidden">
              <Image
                src="/images/basma/basma-community-event.jpg"
                alt="Community Resources"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-[11px] text-[#c9a84c] tracking-widest uppercase mb-2">Hopes Chance</p>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Find Real Support
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">
                Free, confidential resources for housing, jobs, mental health, and more.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {[
            { src: '/images/basma/basma-performing-stage-1.jpg', alt: 'Stage performance', span: 'md:col-span-2 md:row-span-2' },
            { src: '/images/basma/basma-orchestra.jpg', alt: 'Orchestra' },
            { src: '/images/basma/basma-editing-studio.jpg', alt: 'Studio session' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community gathering', span: 'md:col-span-2' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Student recital' },
            { src: '/images/basma/basma-performing-stage-2.jpg', alt: 'Performing' },
          ].map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden ${img.span ?? ''} ${
                img.span?.includes('row-span-2') ? 'h-64 md:h-full min-h-[16rem]' : 'h-48'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes={img.span?.includes('col-span-2') ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
      </section>

      {/* ── MajorWinners CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-[#c9a84c]/50 tracking-[0.3em] uppercase mb-4">Now Playing</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">MajorWinners</span> Game
          </h2>
          <p className="text-white/35 mb-10 max-w-lg mx-auto leading-relaxed">
            Choose your character. Play music games. Earn XP. Your avatar connects across the entire ecosystem.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/game" className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-wide">
              Enter the Game
            </a>
            <a
              href="https://www.viverse.com/YHJwrYG"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-8 py-3.5 rounded-full text-sm tracking-wide"
            >
              Viverse World →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2 gradient-gold inline-block" style={{ fontFamily: "'Playfair Display', serif" }}>
            BasmaWorld
          </p>
          <p className="text-white/20 text-sm mb-1">Music · Community · Opportunity</p>
          <p className="text-white/10 text-xs">&copy; {new Date().getFullYear()} BASMA LLC</p>
        </div>
      </footer>
    </main>
  )
}
