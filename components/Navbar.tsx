'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/academy', label: 'Academy' },
  { href: '/game', label: 'Game' },
  { href: '/navigator', label: 'Navigator' },
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
        scrolled ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.04]' : ''
      }`}
      style={{ top: 'var(--ann-bar-height, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight gradient-gold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          BasmaWorld
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a href="/basma" className="text-sm text-[#c9a84c] hover:text-[#e4cc7a] transition-colors">
            Book a Lesson
          </a>
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
        <div className="md:hidden bg-[#050505]/95 backdrop-blur-md border-t border-white/[0.04] px-6 py-4 animate-fadeIn">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-white/40 hover:text-white py-2.5 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/basma"
            onClick={() => setOpen(false)}
            className="block text-[#c9a84c] py-2.5 text-sm mt-2 border-t border-white/[0.04] pt-4"
          >
            Book a Lesson
          </a>
        </div>
      )}
    </nav>
  )
}
