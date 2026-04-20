import Image from 'next/image'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function Home() {
  return (
    <main className="min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* ── Ambient background ────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.04] blur-[120px]"
             style={{ background: 'radial-gradient(circle, #c9a84c, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px]"
             style={{ background: 'radial-gradient(circle, #9b7dff, transparent)' }} />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Background image */}
        <div className="absolute inset-0 -z-[5]">
          <Image
            src="/images/basma/basma-performing-stage-1.jpg"
            alt="Live performance"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0.6) 40%, rgba(5,5,5,0.95) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-10 text-xs font-medium text-[#c9a84c] tracking-widest uppercase">
            Est. Las Vegas
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Basma</span>
            <span className="text-white">World</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-4 max-w-2xl mx-auto leading-relaxed font-light">
            Where artists evolve, communities connect, and real opportunity begins.
          </p>
          <p className="text-sm text-white/25 mb-14 max-w-lg mx-auto">
            Music education, brand strategy, and youth resources — all under one roof.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/academy"
              className="btn-gold pulse-cta px-10 py-4 rounded-full text-sm font-semibold tracking-wide"
            >
              Start Your Journey
            </a>
            <a
              href="/game"
              className="btn-outline px-10 py-4 rounded-full text-sm tracking-wide"
            >
              Play MajorWinners
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap gap-6 justify-center mt-20 text-xs text-white/25 tracking-wide uppercase">
            <span>500+ Students</span>
            <span className="text-white/10">|</span>
            <span>Las Vegas & Online</span>
            <span className="text-white/10">|</span>
            <span>All Ages Welcome</span>
          </div>
        </div>
      </section>

      {/* ── Photo strip ───────────────────────────────────────────────────── */}
      <section className="py-1 overflow-hidden opacity-60">
        <div className="flex gap-2 photo-strip w-max">
          {[
            { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Live performance' },
            { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Music class' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Student recital' },
            { src: '/images/basma/basma-dance-crew-gym.jpg', alt: 'Dance crew' },
            { src: '/images/basma/basma-broadway-kids-academy.jpg', alt: 'Kids academy' },
            { src: '/images/basma/basma-community-event.jpg', alt: 'Community event' },
            { src: '/images/basma/basma-with-student.jpg', alt: 'Mentorship' },
            { src: '/images/basma/basma-live-music-stage.jpg', alt: 'Live performance' },
            { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Music class' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Student recital' },
          ].map((img, i) => (
            <div key={i} className="relative w-56 h-36 flex-shrink-0 overflow-hidden" style={{ borderRadius: '2px' }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="224px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Three Worlds ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-4 font-medium">The Ecosystem</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Three Worlds. <span className="gradient-gold">One Vision.</span>
          </h2>
          <p className="text-white/30 text-lg max-w-xl mx-auto font-light">
            Everything you need to master your craft, grow your brand, and access real support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Academy Card */}
          <a href="/academy" className="group card-premium rounded-2xl overflow-hidden">
            <div className="relative h-56 overflow-hidden">
              <Image
                src="/images/basma/basma-teaching-classroom.jpg"
                alt="Music Academy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>
            <div className="p-7">
              <p className="text-xs text-[#c9a84c] tracking-widest uppercase mb-3 font-medium">Music Academy</p>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Master Your Instrument
              </h3>
              <p className="text-white/30 text-sm leading-relaxed mb-5">
                Professional vocal coaching, piano, guitar, and music theory. Gamified learning with XP progression.
              </p>
              <span className="text-[#c9a84c] text-sm font-medium group-hover:tracking-wider transition-all duration-300">
                Start Learning →
              </span>
            </div>
          </a>

          {/* MWL Card */}
          <a href="/mwl" className="group card-premium rounded-2xl overflow-hidden">
            <div className="relative h-56 overflow-hidden">
              <Image
                src="/images/basma/basma-with-student.jpg"
                alt="Brand Strategy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>
            <div className="p-7">
              <p className="text-xs text-[#c9a84c] tracking-widest uppercase mb-3 font-medium">Major Winners League</p>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Grow Your Brand
              </h3>
              <p className="text-white/30 text-sm leading-relaxed mb-5">
                Content creation, music marketing, and brand strategy that delivers real, measurable results.
              </p>
              <span className="text-[#c9a84c] text-sm font-medium group-hover:tracking-wider transition-all duration-300">
                Work With Us →
              </span>
            </div>
          </a>

          {/* Hopes Card */}
          <a href="/hopes" className="group card-premium rounded-2xl overflow-hidden">
            <div className="relative h-56 overflow-hidden">
              <Image
                src="/images/basma/basma-community-event.jpg"
                alt="Community Resources"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            </div>
            <div className="p-7">
              <p className="text-xs text-[#c9a84c] tracking-widest uppercase mb-3 font-medium">Hopes Chance</p>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Find Real Support
              </h3>
              <p className="text-white/30 text-sm leading-relaxed mb-5">
                Free, confidential resources for housing, jobs, mental health, and more. No judgment. Ever.
              </p>
              <span className="text-[#c9a84c] text-sm font-medium group-hover:tracking-wider transition-all duration-300">
                Get Help →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Gallery ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-4 font-medium">The Experience</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            More Than a <span className="gradient-gold">Stage</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              className={`relative overflow-hidden group ${img.span ?? ''} ${
                img.span?.includes('row-span-2') ? 'h-64 md:h-full min-h-[16rem]' : 'h-48 md:h-56'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                sizes={img.span?.includes('col-span-2') ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Billy Bob Section ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 glass-gold rounded-2xl p-10 md:p-14">
          <div className="relative w-44 h-44 md:w-56 md:h-56 flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              src="/images/basma-hero.jpg"
              alt="Boddee Billy Bob"
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-3 font-medium">The Mascot</p>
            <h3 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet <span className="gradient-gold">Boddee Billy Bob</span>
            </h3>
            <p className="text-white/40 text-base leading-relaxed mb-8 max-w-lg">
              Part puppet, part hype man, and the undeniable heart of BasmaWorld. If Billy believes in you, that&apos;s all you need.
            </p>
            <a
              href="/academy"
              className="btn-gold px-8 py-3 rounded-full text-sm font-semibold tracking-wide inline-block"
            >
              Join the Family
            </a>
          </div>
        </div>
      </section>

      {/* ── MajorWinners Game CTA ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 md:p-16 text-center">
          <p className="text-xs text-[#c9a84c]/60 tracking-[0.3em] uppercase mb-4 font-medium">Now Playing</p>
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-text">MajorWinners</span> Game
          </h2>
          <p className="text-white/35 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Choose your character. Complete quests. Earn XP in the real world and the Viverse. Your avatar connects across the entire ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/game"
              className="btn-gold px-10 py-4 rounded-full text-sm font-semibold tracking-wide"
            >
              Enter the Game
            </a>
            <a
              href="https://www.viverse.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-10 py-4 rounded-full text-sm tracking-wide"
            >
              Launch Viverse World
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xl font-semibold mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #e4cc7a, #c9a84c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            BasmaWorld
          </p>
          <p className="text-white/20 text-sm mb-1">Music · Community · Opportunity</p>
          <p className="text-white/10 text-xs">&copy; {new Date().getFullYear()} BASMA LLC. All rights reserved.</p>
        </div>
      </footer>

    </main>
  )
}
