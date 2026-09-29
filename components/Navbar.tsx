'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/private-lessons', label: 'Private Lessons', highlight: true },
  { href: '/portal', label: 'Parent Portal' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0D0118]/95 backdrop-blur-md border-b border-white/[0.04]' : ''
      }`}
      style={{ top: 'var(--ann-bar-height, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight" style={{ color: '#c9a84c', fontFamily: "'Playfair Display', serif" }}>
            B.A.S.M.A.
          </span>
          <span className="hidden sm:inline text-xs text-white/30 font-medium">Music Academy</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                link.highlight
                  ? 'text-white/70 hover:text-white hover:bg-white/5 font-medium'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/private-lessons"
            className="ml-2 text-sm font-bold px-5 py-2 rounded-full transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}
          >
            Book a Lesson
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-white/40 hover:text-white w-8 h-8 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0D0118]/98 backdrop-blur-md border-t border-white/[0.04] px-6 py-3">
                    {/* Lessons & Services */}
          <div className="mb-2">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1 px-2">Lessons & Services</p>
            {[
              { href: '/private-lessons', label: '🎹 Private Lessons' },
              { href: '/social-media', label: '📱 Marketing Services' },
            ].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block text-white/60 hover:text-white py-2 px-2 text-sm transition-colors rounded-lg hover:bg-white/5">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* Portals & Contact */}
          <div className="mb-2">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1 px-2">Account</p>
            {[
              { href: '/portal', label: '👨‍👩‍👧 Parent Portal' },
              { href: '/contact', label: '💬 Contact Us' },
            ].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="block text-white/60 hover:text-white py-2 px-2 text-sm transition-colors rounded-lg hover:bg-white/5">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/5 my-3" />

          <Link href="/private-lessons" onClick={() => setOpen(false)}
            className="block text-center py-3 rounded-full font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #FFE07A)', color: '#0D0118' }}>
            Book a Lesson →
          </Link>
        </div>
      )}
    </nav>
  )
}
