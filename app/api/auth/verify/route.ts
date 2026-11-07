import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { verifyLoginCode } from '@/lib/otp'
import { findParent } from '@/lib/parent-lookup'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

/** Parent portal login, step 2: email + phone + code → signed session cookie. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`auth-verify:${ip}`, 10, 5 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })
  }

  try {
    const { email, phone, code } = await req.json()

    if (!email || !phone || !code || typeof email !== 'string' || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }

    const valid = await verifyLoginCode(email, 'parent', String(code))
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired code. Please try again.' }, { status: 401 })
    }

    const parent = await findParent(email, phone)
    if (!parent) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }

    await createSession({
      id: parent.id,
      email: parent.email,
      phone: parent.phone,
      parentName: parent.parentName,
      role: 'parent',
    })

    return NextResponse.json({
      success: true,
      user: {
        parentName: parent.parentName,
        email: parent.email,
      },
    })
  } catch (error) {
    console.error('[auth/verify] error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
