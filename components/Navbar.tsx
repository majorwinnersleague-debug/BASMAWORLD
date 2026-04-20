'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/academy', label: 'Academy' },
  { href: '/navigator', label: 'Navigator' },
  { href: '/game', label: 'MajorWinners' },
  { href: '/mwl', label: 'MWL' },
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
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl border-b border-white/[0.06]'
          : 'border-b border-transparent'
      }`}
      style={{
        top: 'var(--ann-bar-height, 0px)',
        background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg, #e4cc7a, #c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          BasmaWorld
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/basma"
            className="btn-gold px-5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase"
          >
            Book a Lesson
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white transition-colors w-8 h-8 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
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

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden border-t border-white/[0.06] px-6 py-6 flex flex-col gap-1 animate-fadeIn"
          style={{ background: 'rgba(5, 5, 5, 0.95)', backdropFilter: 'blur(24px)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white py-3 text-sm font-medium transition-colors border-b border-white/[0.04] last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/basma"
            onClick={() => setOpen(false)}
            className="btn-gold mt-4 px-5 py-3 rounded-full text-xs font-semibold tracking-wide uppercase text-center"
          >
            Book a Lesson
          </a>
        </div>
      )}
    </nav>
  )
}
