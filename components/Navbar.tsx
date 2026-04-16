'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-yellow-400 transition">
          BasmaWorld
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-5 text-sm font-medium items-center">
          <Link href="/mwl" className="text-gray-300 hover:text-yellow-400 transition">MWL</Link>
          <Link href="/basma" className="text-gray-300 hover:text-purple-400 transition">BASMA</Link>
          <Link href="/hopes" className="text-gray-300 hover:text-green-400 transition">Hopes Chance</Link>
          <Link href="/vegan-survivors" className="text-gray-300 hover:text-orange-400 transition">Vegan Survivors</Link>
          <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-full font-semibold transition text-xs">
            Links
          </a>
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden text-white text-2xl" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? 'X' : '='}
        </button>
      </div>
      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/mwl" onClick={() => setOpen(false)} className="text-yellow-400">MWL</Link>
          <Link href="/basma" onClick={() => setOpen(false)} className="text-purple-400">BASMA</Link>
          <Link href="/hopes" onClick={() => setOpen(false)} className="text-green-400">Hopes Chance</Link>
          <Link href="/vegan-survivors" onClick={() => setOpen(false)} className="text-orange-400">Vegan Survivors</Link>
          <a href="https://linktr.ee/BASMATea" target="_blank" rel="noopener noreferrer" className="text-gray-300">Linktree</a>
        </div>
      )}
    </nav>
  )
}
