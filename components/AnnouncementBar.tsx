'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const DISMISSED_KEY = 'basmaworld_announcement_dismissed'
const BAR_HEIGHT = '32px'

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
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 px-4"
      style={{
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        height: BAR_HEIGHT,
      }}
    >
      <span className="text-white/30 text-xs">
        Book a <span className="text-[#c9a84c]">free</span> trial lesson
      </span>
      <Link href="/basma" className="text-[#c9a84c] text-xs hover:text-[#e4cc7a] transition-colors">
        Reserve →
      </Link>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 text-white/15 hover:text-white/30 text-xs transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
