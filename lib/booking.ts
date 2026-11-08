/**
 * Booking links (Google Calendar appointment schedules for
 * becomeasingermusicacademy@gmail.com). Set in Vercel; not secrets:
 *   NEXT_PUBLIC_BOOKING_URL_30MIN  – 30-minute private lesson
 *   NEXT_PUBLIC_BOOKING_URL_60MIN  – 60-minute private lesson
 *   NEXT_PUBLIC_BOOKING_URL_TRIAL  – free 15-minute trial
 * Buttons only appear for links that are set and use https.
 */

function clean(url: string | undefined): string {
  const u = (url || '').trim()
  return /^https:\/\/[^\s]+$/.test(u) ? u : ''
}

export const BOOKING_LINKS = {
  min30: clean(process.env.NEXT_PUBLIC_BOOKING_URL_30MIN),
  min60: clean(process.env.NEXT_PUBLIC_BOOKING_URL_60MIN),
  trial: clean(process.env.NEXT_PUBLIC_BOOKING_URL_TRIAL),
}

export function bookingLinkFor(minutes: number): string {
  if (minutes === 15) return BOOKING_LINKS.trial
  return minutes >= 60 ? BOOKING_LINKS.min60 : BOOKING_LINKS.min30
}

export const HAS_LESSON_BOOKING = Boolean(BOOKING_LINKS.min30 || BOOKING_LINKS.min60)
