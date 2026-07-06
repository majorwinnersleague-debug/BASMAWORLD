'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [barRef, setBarRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (barRef) {
      const h = barRef.offsetHeight + 'px'
      document.documentElement.style.setProperty('--ann-bar-height', h)
    }
    return () => {
      document.documentElement.style.setProperty('--ann-bar-height', '0px')
    }
  }, [barRef])

  return (
    <div
      ref={setBarRef}
      className="fixed top-0 left-0 right-0 z-[60]"
      style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)', borderBottom: '2px solid rgba(201,168,76,0.4)' }}
    >
      {/* Academy + scholarship */}
      <div className="flex items-center justify-center gap-2 px-4 py-2">
        <span className="text-white text-xs md:text-sm text-center">
          🎵 BASMA Academy — Mon–Thu at{' '}
          <strong className="text-yellow-300">Synergy Dance: 9512 W Flamingo Rd STE 100</strong>{' '}
          · <span className="text-yellow-200 font-semibold">🎓 Scholarship — $250/mo for the whole family!</span>{' '}
          <Link href="/scholarship" className="underline text-yellow-300 hover:text-white transition font-bold ml-1">
            Learn More →
          </Link>
        </span>
      </div>
    </div>
  )
}
