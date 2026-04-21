import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
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

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="gradient-gold">Basma</span>
            <span className="text-white">World</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            <Link href="/academy" className="text-white/70 hover:text-[#c9a84c] transition">Music education</Link>,{' '}
            <Link href="/hopes" className="text-white/70 hover:text-[#c9a84c] transition">community</Link>, and{' '}
            <Link href="/mwl" className="text-white/70 hover:text-[#c9a84c] transition">real opportunity</Link> — all under one roof.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/academy" className="btn-gold px-10 py-4 rounded-full text-base tracking-wide">
              Start Learning
            </Link>
            <Link href="/game" className="btn-outline px-10 py-4 rounded-full text-base tracking-wide">
              Play MajorWinners
            </Link>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ─────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <p className="text-sm text-[#c9a84c]/50 tracking-[0.2em] uppercase text-center mb-4">The Ecosystem</p>
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-14 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Three Worlds. <span className="gradient-gold">One Vision.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { href: '/academy', src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Music Academy', label: 'Music Academy', title: 'Master Your Instrument', desc: 'Vocals, piano, guitar, and music theory with gamified XP progression.' },
            { href: '/mwl', src: '/images/basma/basma-with-student.jpg', alt: 'Brand Strategy', label: 'Major Winners League', title: 'Grow Your Brand', desc: 'Content creation, music marketing, and brand strategy with real results.' },
            { href: '/hopes', src: '/images/basma/basma-community-event.jpg', alt: 'Community Resources', label: 'Hopes Chance', title: 'Find Real Support', desc: 'Free, confidential resources for housing, jobs, mental health, and more.' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-5">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
              </div>
              <p className="text-xs text-[#c9a84c] tracking-widest uppercase mb-2">{item.label}</p>
              <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#c9a84c] transition" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.title}
              </h3>
              <p className="text-base text-white/40 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Gallery — uniform 3×2 grid ────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {[
            { src: '/images/basma/basma-performing-stage-1.jpg', alt: 'Stage performance' },
            { src: '/images/basma/basma-orchestra.jpg', alt: 'Orchestra' },
            { src: '/images/basma/basma-teaching-classroom.jpg', alt: 'Teaching' },
            { src: '/images/basma/basma-community-daytime.jpg', alt: 'Community gathering' },
            { src: '/images/basma/students-recital-performance.jpg', alt: 'Student recital' },
            { src: '/images/basma/basma-performing-stage-2.jpg', alt: 'Performing' },
          ].map((img, i) => (
            <div key={i} className="relative aspect-[3/2] overflow-hidden rounded-lg">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="33vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── MajorWinners CTA ──────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#c9a84c]/50 tracking-[0.2em] uppercase mb-4">Now Playing</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <Link href="/game" className="gradient-gold hover:opacity-80 transition">MajorWinners</Link> Game
          </h2>
          <p className="text-lg text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed">
            Choose your character. Play <Link href="/game" className="text-white/60 hover:text-[#c9a84c] transition">music games</Link>.
            Earn XP. Your avatar connects across the{' '}
            <a href="https://www.viverse.com/YHJwrYG" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c9a84c] transition">Viverse</a>{' '}
            and the entire <Link href="/academy" className="text-white/60 hover:text-[#c9a84c] transition">ecosystem</Link>.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/game" className="btn-gold px-10 py-4 rounded-full text-base tracking-wide">
              Enter the Game
            </Link>
            <a
              href="https://www.viverse.com/YHJwrYG"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-10 py-4 rounded-full text-base tracking-wide"
            >
              Viverse World →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl font-semibold mb-3 gradient-gold inline-block" style={{ fontFamily: "'Playfair Display', serif" }}>
            BasmaWorld
          </p>
          <p className="text-white/30 text-base mb-4">
            <Link href="/academy" className="hover:text-[#c9a84c] transition">Music</Link> ·{' '}
            <Link href="/hopes" className="hover:text-[#c9a84c] transition">Community</Link> ·{' '}
            <Link href="/mwl" className="hover:text-[#c9a84c] transition">Opportunity</Link>
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-white/20">
            <Link href="/contact" className="hover:text-white/50 transition">Contact</Link>
            <Link href="/navigator" className="hover:text-white/50 transition">Navigator</Link>
            <Link href="/game" className="hover:text-white/50 transition">Game</Link>
            <a href="https://www.viverse.com/YHJwrYG" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition">Viverse</a>
          </div>
          <p className="text-white/10 text-sm mt-4">&copy; {new Date().getFullYear()} BASMA LLC</p>
        </div>
      </footer>
    </main>
  )
}
