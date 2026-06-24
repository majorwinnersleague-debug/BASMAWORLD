'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const BAR_HEIGHT = '0px' // dynamic

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
      style={{ background: 'linear-gradient(90deg, #b91c1c, #dc2626)', borderBottom: '2px solid #fbbf24' }}
    >
      {/* Line 1: Address correction */}
      <div className="flex items-center justify-center gap-2 px-4 py-1.5"
           style={{ background: 'rgba(0,0,0,0.3)' }}>
        <span className="text-white text-xs md:text-sm font-bold text-center">
          📍 We are <span className="underline">NOT</span> at 330 W Washington Ave.{' '}
          <span className="text-yellow-300">New location: 6787 W Tropicana Ave, Suite 260, Las Vegas, NV 89103</span>
        </span>
      </div>
      {/* Line 2: Camp info */}
      <div className="flex items-center justify-center gap-2 px-4 py-1.5"
           style={{ background: 'rgba(0,0,0,0.15)' }}>
        <span className="text-white text-xs md:text-sm text-center">
          🏕️ Starting June 29 — ALL camps at <strong className="text-yellow-300">Synergy Dance: 9512 W Flamingo Rd STE 100, Las Vegas, NV 89147</strong>{' '}
          · First week FREE for new paid camp!{' '}
          · <span className="text-yellow-200 font-semibold">Limited spots for free program!</span>{' '}
          <Link href="/enroll" className="underline text-yellow-300 hover:text-white transition font-bold ml-1">
            Sign Up Now →
          </Link>
        </span>
      </div>
    </div>
  )
}
