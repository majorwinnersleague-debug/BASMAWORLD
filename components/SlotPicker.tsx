'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatDayLabel, formatTimeLabel } from '@/lib/tz'

export interface PickerSlot { startsAt: string; date: string; time: string }

/**
 * Lets a family pick an open time: first a day, then a time.
 * Loads open times from `url` (expects { slots: PickerSlot[] }).
 */
export default function SlotPicker({
  url,
  value,
  onChange,
  emptyText = 'No open times right now — please call (702) 788-7369 and we’ll fit you in.',
}: {
  url: string
  value: string
  onChange: (startsAt: string) => void
  emptyText?: string
}) {
  const [slots, setSlots] = useState<PickerSlot[] | null>(null)
  const [day, setDay] = useState('')

  useEffect(() => {
    let cancelled = false
    setSlots(null)
    fetch(url, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (!cancelled) setSlots(Array.isArray(d.slots) ? d.slots : []) })
      .catch(() => { if (!cancelled) setSlots([]) })
    return () => { cancelled = true }
  }, [url])

  const days = useMemo(() => Array.from(new Set((slots || []).map(s => s.date))), [slots])
  useEffect(() => { if (days.length && !days.includes(day)) setDay(days[0]) }, [days, day])

  if (slots === null) return <p className="text-white/40 text-sm py-2">Loading open times…</p>
  if (!slots.length) return <p className="text-white/40 text-sm py-2">{emptyText}</p>

  const times = slots.filter(s => s.date === day)
  const chip = (active: boolean) =>
    `px-3 py-2 rounded-lg text-xs font-semibold transition border ${active ? 'border-[#c9a84c] text-[#0D0118] bg-[#c9a84c]' : 'border-white/10 text-white/70 hover:border-white/30'}`

  return (
    <div className="space-y-3">
      <div>
        <p className="text-white/40 text-[11px] uppercase tracking-widest mb-2">Pick a day</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map(d => (
            <button key={d} type="button" onClick={() => setDay(d)} className={chip(d === day) + ' whitespace-nowrap'}>
              {formatDayLabel(d)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-white/40 text-[11px] uppercase tracking-widest mb-2">Pick a time (Pacific)</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {times.map(s => (
            <button key={s.startsAt} type="button" onClick={() => onChange(s.startsAt)} className={chip(value === s.startsAt)}>
              {formatTimeLabel(s.time)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
