import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'
import { CreditError } from '@/lib/credits'
import { bookLesson, cancelBooking, getBooking, getBookingsForGuardian, getOpenSlots, studentBelongsTo } from '@/lib/schedule'
import { sendBookingConfirmation, sendCancellationNotice } from '@/lib/booking-emails'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * Parent portal booking (Phase 3). Parent session required; parents can only
 * book and cancel for their own students.
 * GET  ?slots=30|60  → open times;  GET → this family's bookings
 * POST { action: 'book', studentId, minutes, startsAt } | { action: 'cancel', bookingId }
 */

function fail(error: unknown) {
  if (error instanceof CreditError) return NextResponse.json({ error: error.message }, { status: error.status })
  console.error('[portal/bookings] error:', error)
  return NextResponse.json({ error: 'Something went wrong. Nothing was changed.' }, { status: 500 })
}

export async function GET(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!sql) return NextResponse.json({ bookings: [], slots: [] })
  try {
    const m = req.nextUrl.searchParams.get('slots')
    if (m === '30' || m === '60') return NextResponse.json({ slots: await getOpenSlots(Number(m)) })
    return NextResponse.json({ bookings: await getBookingsForGuardian(user.email) })
  } catch (error) {
    return fail(error)
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!sql) return NextResponse.json({ error: 'Booking is temporarily unavailable.' }, { status: 503 })
  const { allowed } = checkRateLimit(`portal-booking:${user.email}`, 20, 10 * 60 * 1000)
  if (!allowed) return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  try {
    if (body.action === 'book') {
      const studentId = Number(body.studentId)
      const minutes = Number(body.minutes) === 60 ? 60 : Number(body.minutes) === 30 ? 30 : 0
      const startsAt = typeof body.startsAt === 'string' ? body.startsAt : ''
      if (!Number.isInteger(studentId) || !minutes || !startsAt) {
        return NextResponse.json({ error: 'Pick a student, lesson length and time.' }, { status: 400 })
      }
      if (!(await studentBelongsTo(studentId, user.email))) {
        return NextResponse.json({ error: 'Student not found on your account.' }, { status: 403 })
      }
      const { bookingId } = await bookLesson({ studentId, minutes: minutes as 30 | 60, startsAt, by: user.email })
      const booking = await getBooking(bookingId)
      if (booking) await sendBookingConfirmation(booking)
      return NextResponse.json({ success: true, booking })
    }

    if (body.action === 'cancel') {
      const bookingId = Number(body.bookingId)
      if (!Number.isInteger(bookingId)) return NextResponse.json({ error: 'Invalid booking' }, { status: 400 })
      const booking = await getBooking(bookingId)
      if (!booking || booking.guardianEmail.toLowerCase() !== user.email.trim().toLowerCase()) {
        return NextResponse.json({ error: 'Booking not found on your account.' }, { status: 404 })
      }
      const { creditReturned } = await cancelBooking({ bookingId, by: user.email, asParent: true, returnCredit: true })
      await sendCancellationNotice(booking, creditReturned)
      return NextResponse.json({ success: true, creditReturned })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return fail(error)
  }
}
