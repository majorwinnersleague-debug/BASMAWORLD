'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const DISMISSED_KEY = 'basmaworld_announcement_dismissed'
const BAR_HEIGHT = '36px'

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    const saved = localStorage.getItem(DISMISSED_KEY)
    if (saved !== 'true') {
      setDismissed(false)
      document.documentElement.style.setProperty('--ann-bar-height', BAR_HEIGHT)
    } else {
      document.documentElement.style.setProperty('--ann-bar-height', '0px')
    }
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    document.documentElement.style.setProperty('--ann-bar-height', '0px')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5"
      style={{
        background: 'linear-gradient(90deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.4)',
        height: BAR_HEIGHT,
      }}
    >
      {/* Left spacer — mirrors the close button to keep text centered */}
      <div className="w-7 flex-shrink-0" />

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center gap-2 sm:gap-4 flex-wrap min-w-0">
        <span className="text-gray-200 text-xs sm:text-sm font-medium text-center leading-snug">
          🎵{' '}
          <span className="hidden sm:inline">
            Limited Spots Available —{' '}
          </span>
          Book Your{' '}
          <span className="text-purple-300 font-bold">FREE</span> Trial Music Lesson Today!
        </span>
        <Link
          href="/basma"
          className="flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full transition-colors duration-200 whitespace-nowrap"
          style={{ boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}
        >
          Book Now →
        </Link>
      </div>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-150 text-base leading-none"
      >
        ✕
      </button>
    </div>
  )
}
