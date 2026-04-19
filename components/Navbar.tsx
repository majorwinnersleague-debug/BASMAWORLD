'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home', color: 'hover:text-yellow-400' },
  { href: '/mwl', label: 'MWL', color: 'hover:text-yellow-400' },
  { href: '/mwm', label: 'MWM', color: 'hover:text-blue-400' },
  { href: '/basma', label: 'BASMA', color: 'hover:text-purple-400' },
  { href: '/contact', label: 'Contact', color: 'hover:text-white' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed left-0 right-0 z-50 backdrop-blur-md border-b border-purple-500/20" style={{ top: 'var(--ann-bar-height, 0px)', background: 'rgba(15, 2, 37, 0.92)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-black hover:opacity-90 transition" style={{ background: 'linear-gradient(90deg, #fbbf24, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          BasmaWorld ✨
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-gray-300 ${link.color} transition`}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://linktr.ee/BASMATea"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-full font-semibold transition text-xs"
          >
            Links
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-gray-300 ${link.color} py-2 transition`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://linktr.ee/BASMATea"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 py-2"
            onClick={() => setOpen(false)}
          >
            🌍 Linktree
          </a>
        </div>
      )}
    </nav>
  )
}
