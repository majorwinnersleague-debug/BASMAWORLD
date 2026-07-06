'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [barRef, setBarRef] = useState<HTMLDivElement | null>(null)
  const [closures, setClosures] = useState<{ date: string; note: string }[]>([])

  useEffect(() => {
    if (barRef) {
      const h = barRef.offsetHeight + 'px'
      document.documentElement.style.setProperty('--ann-bar-height', h)
    }
    return () => {
      document.documentElement.style.setProperty('--ann-bar-height', '0px')
    }
  }, [barRef, closures])

  // Fetch upcoming closures from the calendar API
  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => {
        const events = (data.events || []) as { date: string; note: string; type: string }[]
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Show closures in the next 14 days
        const upcoming = events
          .filter(e => {
            const d = new Date(e.date + 'T00:00:00')
            return d >= today && d <= new Date(today.getTime() + 14 * 86400000)
          })
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 3)
        setClosures(upcoming)
      })
      .catch(() => {})
  }, [])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div
      ref={setBarRef}
      className="fixed top-0 left-0 right-0 z-[60]"
      style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)', borderBottom: '2px solid rgba(201,168,76,0.4)' }}
    >
      {/* Closures alert — shown when there are upcoming closures */}
      {closures.length > 0 && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5" style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-white text-xs md:text-sm text-center">
            🚫 <strong className="text-red-300">Upcoming Closure{closures.length > 1 ? 's' : ''}:</strong>{' '}
            {closures.map((c, i) => (
              <span key={c.date}>
                {i > 0 && ' · '}
                <strong className="text-red-200">{formatDate(c.date)}</strong>
                {c.note && <span className="text-red-300/70"> ({c.note})</span>}
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Academy info */}
      <div className="flex items-center justify-center gap-2 px-4 py-1.5">
        <span className="text-white text-xs md:text-sm text-center">
          🎵 <strong className="text-yellow-300">BASMA Academy</strong> — Mon–Thu · 9:00 AM – 2:15 PM · Synergy Dance{' '}
          · <Link href="/scholarship" className="text-yellow-200 font-semibold hover:text-white transition">
            🎓 Scholarship $250/mo →
          </Link>
        </span>
      </div>
    </div>
  )
}
