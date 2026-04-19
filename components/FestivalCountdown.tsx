'use client'
import { useEffect, useState } from 'react'

const FESTIVAL_DATE = new Date('2026-10-24T18:00:00-07:00') // 6pm Las Vegas time

export default function FestivalCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = FESTIVAL_DATE.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [])

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
      {units.map((u) => (
        <div key={u.label} className="bg-white/[0.05] border border-[#F59E0B]/20 rounded-xl p-3 text-center">
          <p className="text-2xl md:text-3xl font-bold text-[#F59E0B] tabular-nums">
            {String(u.value).padStart(2, '0')}
          </p>
          <p className="text-white/30 text-xs mt-1">{u.label}</p>
        </div>
      ))}
    </div>
  )
}
