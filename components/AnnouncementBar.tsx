'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const DISMISSED_KEY = 'basmaworld_announcement_dismissed'
const BAR_HEIGHT = '36px'

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true)

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
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between gap-2 px-3"
      style={{
        background: 'linear-gradient(90deg, #050505, #0d0a00, #050505)',
        borderBottom: '1px solid rgba(201, 168, 76, 0.15)',
        height: BAR_HEIGHT,
      }}
    >
      <div className="w-7 flex-shrink-0" />

      <div className="flex flex-1 items-center justify-center gap-3 min-w-0">
        <span className="text-white/50 text-xs font-medium tracking-wide">
          <span className="hidden sm:inline">Limited Availability — </span>
          Book Your <span className="text-[#c9a84c] font-semibold">Free</span> Trial Lesson
        </span>
        <Link
          href="/basma"
          className="flex-shrink-0 text-[#c9a84c] hover:text-[#e4cc7a] text-xs font-semibold tracking-wide transition-colors duration-200 border-b border-[#c9a84c]/30 hover:border-[#c9a84c]/60 pb-px"
        >
          Reserve Now
        </Link>
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white/20 hover:text-white/50 transition-colors duration-200 text-xs"
      >
        ✕
      </button>
    </div>
  )
}
