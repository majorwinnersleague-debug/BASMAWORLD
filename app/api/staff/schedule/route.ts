import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession, staffUnauthorized } from '@/lib/auth'
import { CreditError } from '@/lib/credits'
import {
  addBlock, addRule, cancelBooking, getAvailability, getBooking, getBookingsForStaff,
  markBooking, removeBlock, removeRule,
} from '@/lib/schedule'
import { sendCancellationNotice } from '@/lib/booking-emails'

export const dynamic = 'force-dynamic'

/**
 * Staff schedule (Phase 3). Staff sign-in required.
 * - Any staff: view hours and bookings, mark attended / no-show, cancel a booking.
 * - Admins only: change teaching hours and blocked days; cancel without
 *   returning the credit.
 */

function fail(error: unknown) {
  if (error instanceof CreditError) return NextResponse.json({ error: error.message }, { status: error.status })
  console.error('[staff/schedule] error:', error)
  return NextResponse.json({ error: 'Something went wrong. Nothing was changed.' }, { status: 500 })
}

export async function GET() {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()
  try {
    const [availability, bookings] = await Promise.all([getAvailability(), getBookingsForStaff()])
    return NextResponse.json({ ...availability, bookings, role: staff.role })
  } catch (error) {
    return fail(error)
  }
}

export async function POST(req: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const isAdmin = staff.role === 'admin'
  const adminOnly = () => NextResponse.json({ error: 'Only an admin can change teaching hours. Nothing was changed.' }, { status: 403 })
  const id = Number(body.id)

  try {
    switch (body.action) {
      case 'add_rule':
        if (!isAdmin) return adminOnly()
        await addRule({ weekday: Number(body.weekday), startTime: String(body.startTime || ''), endTime: String(body.endTime || ''), by: staff.email })
        return NextResponse.json({ success: true })
      case 'remove_rule':
        if (!isAdmin) return adminOnly()
        if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
        await removeRule(id)
        return NextResponse.json({ success: true })
      case 'add_block':
        if (!isAdmin) return adminOnly()
        await addBlock({ date: String(body.date || ''), reason: typeof body.reason === 'string' ? body.reason : '', by: staff.email })
        return NextResponse.json({ success: true })
      case 'remove_block':
        if (!isAdmin) return adminOnly()
        if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
        await removeBlock(id)
        return NextResponse.json({ success: true })
      case 'mark': {
        const outcome = body.outcome === 'attended' || body.outcome === 'no_show' ? body.outcome : null
        if (!Number.isInteger(id) || !outcome) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
        const result = await markBooking({ bookingId: id, outcome, by: staff.email })
        return NextResponse.json({ success: true, ...result })
      }
      case 'cancel': {
        if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
        const returnCredit = body.returnCredit !== false
        if (!returnCredit && !isAdmin) {
          return NextResponse.json({ error: 'Only an admin can cancel without returning the credit.' }, { status: 403 })
        }
        const booking = await getBooking(id)
        const result = await cancelBooking({
          bookingId: id, by: staff.email, asParent: false, returnCredit,
          reason: typeof body.reason === 'string' ? body.reason : '',
        })
        if (booking && body.notify !== false) await sendCancellationNotice(booking, result.creditReturned)
        return NextResponse.json({ success: true, ...result })
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return fail(error)
  }
}
