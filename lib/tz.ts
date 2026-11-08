import { TIMEZONE } from './schedule-policy'

/**
 * Pacific-time helpers that are correct across daylight-saving changes.
 * Dates are 'YYYY-MM-DD', times 'HH:MM' (24-hour), always in TIMEZONE.
 */

const partsFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
})

function zoneParts(d: Date) {
  const p: Record<string, number> = {}
  for (const { type, value } of partsFmt.formatToParts(d)) {
    if (type !== 'literal') p[type] = Number(value)
  }
  return p as { year: number; month: number; day: number; hour: number; minute: number; second: number }
}

/** Offset of TIMEZONE from UTC at instant d, in minutes (e.g. -480 for PST). */
function offsetMinutes(d: Date): number {
  const p = zoneParts(d)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - d.getTime()) / 60000)
}

/** The UTC instant of a Pacific wall-clock date + time. */
export function zonedToUtc(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  let utc = guess - offsetMinutes(new Date(guess)) * 60000
  // Second pass settles the offset around DST transitions.
  utc = guess - offsetMinutes(new Date(utc)) * 60000
  return new Date(utc)
}

/** 'YYYY-MM-DD' of instant d in Pacific time. */
export function zonedDate(d: Date): string {
  const p = zoneParts(d)
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
}

/** 'HH:MM' of instant d in Pacific time. */
export function zonedTime(d: Date): string {
  const p = zoneParts(d)
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

/** Day of week (0 = Sunday) of a 'YYYY-MM-DD' date. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** date + n days, as 'YYYY-MM-DD'. */
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}

export function minutesOfDay(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function timeOfMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/** "Tue, Nov 18" */
export function formatDayLabel(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

/** "3:30 PM" */
export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** "Tue, Nov 18 · 3:30 PM" for an instant. */
export function formatInstant(d: Date): string {
  return `${formatDayLabel(zonedDate(d))} · ${formatTimeLabel(zonedTime(d))}`
}
