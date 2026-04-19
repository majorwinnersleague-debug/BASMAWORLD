'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const mwlLinks = [
  { href: '/mwl/basmateachme', label: '🪆 BasmaTeach Me' },
  { href: '/mwl/podcast', label: '🎙️ Podcast' },
  { href: '/mwl#positive', label: '💛 I Am Positive' },
  { href: '/mwl#gaming', label: '🎮 Gaming' },
  { href: '/mwl#vegan', label: '🥦 Vegan Survivors' },
  { href: '/hopes', label: '🤝 Hopes Chance' },
]

function DropdownMenu({
  label,
  href,
  items,
  accentClass,
}: {
  label: string
  href: string
  items: { href: string; label: string }[]
  accentClass: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        className={`flex items-center gap-1 text-gray-300 hover:${accentClass} transition text-sm font-medium`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Link
          href={href}
          className={`hover:${accentClass} transition`}
          onClick={(e) => e.stopPropagation()}
        >
          {label}
        </Link>
        <span className="text-xs opacity-60 select-none">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-black/95 border border-white/10 rounded-xl shadow-2xl py-2 z-[60]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm text-gray-300 hover:${accentClass} hover:bg-white/5 transition`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mwlMobileOpen, setMwlMobileOpen] = useState(false)

  return (
    <nav className="fixed left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10" style={{ top: 'var(--ann-bar-height, 0px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-yellow-400 transition">
          BasmaWorld
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 text-sm font-medium items-center">
          <DropdownMenu
            label="MWL"
            href="/mwl"
            items={mwlLinks}
            accentClass="text-yellow-400"
          />
          <Link href="/basma" className="text-gray-300 hover:text-purple-400 transition">BASMA</Link>
          <Link href="/academy" className="text-gray-300 hover:text-blue-400 transition">Academy</Link>
          <Link href="/hopes" className="text-gray-300 hover:text-green-400 transition">Hopes Chance</Link>
          <Link href="/gateway" className="text-gray-300 hover:text-yellow-400 transition font-semibold">🎭 Festival</Link>
          <Link href="/vegan-survivors" className="text-gray-300 hover:text-orange-400 transition">Vegan Survivors</Link>
          <Link href="/blog" className="text-gray-300 hover:text-white/80 transition text-sm font-medium">Blog</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition text-sm font-medium">Contact</Link>
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
          {/* MWL with accordion sub-items */}
          <div>
            <div className="flex items-center justify-between">
              <Link
                href="/mwl"
                onClick={() => setOpen(false)}
                className="text-yellow-400 py-2 block"
              >
                MWL
              </Link>
              <button
                onClick={() => setMwlMobileOpen((v) => !v)}
                className="text-yellow-400 opacity-60 px-2 py-1 text-xs"
                aria-label="Toggle MWL sub-menu"
              >
                {mwlMobileOpen ? '▲' : '▼'}
              </button>
            </div>
            {mwlMobileOpen && (
              <div className="flex flex-col gap-1 pl-4 border-l border-yellow-800/50 mb-2">
                {mwlLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => { setOpen(false); setMwlMobileOpen(false) }}
                    className="text-gray-400 hover:text-yellow-400 transition py-1.5 text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/basma" onClick={() => setOpen(false)} className="text-purple-400 py-2">BASMA</Link>
          <Link href="/academy" onClick={() => setOpen(false)} className="text-blue-400 py-2">Academy</Link>
          <Link href="/hopes" onClick={() => setOpen(false)} className="text-green-400 py-2">Hopes Chance</Link>
          <Link href="/gateway" onClick={() => setOpen(false)} className="text-yellow-400 py-2 font-semibold">🎭 Gateway Festival</Link>
          <Link href="/vegan-survivors" onClick={() => setOpen(false)} className="text-orange-400 py-2">Vegan Survivors</Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="text-white/70 py-2">Blog</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="text-white/70 py-2">Contact</Link>
          <a
            href="https://linktr.ee/BASMATea"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 py-2"
            onClick={() => setOpen(false)}
          >
            Linktree
          </a>
        </div>
      )}
    </nav>
  )
}
