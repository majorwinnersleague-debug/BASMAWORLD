import { NextRequest, NextResponse } from 'next/server'
import { createStaffSession, getStaffRole } from '@/lib/auth'
import { verifyLoginCode } from '@/lib/otp'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

/** Staff login, step 2: email + code → signed 12-hour staff session cookie. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`staff-verify:${ip}`, 10, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })
  }

  try {
    const { email, code } = await req.json()
    if (!email || !code || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }

    const role = getStaffRole(email)
    const valid = role ? await verifyLoginCode(email, 'staff', String(code)) : false
    if (!role || !valid) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 401 })
    }

    const normalized = email.trim().toLowerCase()
    await createStaffSession({ email: normalized, role })
    return NextResponse.json({ success: true, user: { email: normalized, role } })
  } catch (error) {
    console.error('[staff/verify] error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
