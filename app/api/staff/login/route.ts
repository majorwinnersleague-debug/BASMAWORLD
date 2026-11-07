import { NextRequest, NextResponse } from 'next/server'
import { getStaffRole } from '@/lib/auth'
import { issueLoginCode, OtpRateLimitError } from '@/lib/otp'
import { sendLoginCodeEmail } from '@/lib/auth-email'
import { checkRateLimit, getClientIp, isValidEmail } from '@/lib/rate-limit'

/**
 * Staff login, step 1: email → 6-digit code, only if the email is on the
 * staff allow-list (ADMIN_EMAILS / TEACHER_EMAILS). The response is the same
 * whether or not the email is staff, so the list can't be probed.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`staff-login:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  const genericOk = NextResponse.json({
    success: true,
    message: 'If that email belongs to BASMA staff, a login code is on its way.',
  })

  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }

    const role = getStaffRole(email)
    if (!role) return genericOk

    const code = await issueLoginCode(email, 'staff')
    const sent = await sendLoginCodeEmail({ to: email.trim().toLowerCase(), code, portal: 'Teacher Portal' })
    if (!sent) {
      return NextResponse.json(
        { error: "We couldn't send the login code. Check the Resend configuration." },
        { status: 503 }
      )
    }
    return genericOk
  } catch (error) {
    if (error instanceof OtpRateLimitError) {
      return NextResponse.json({ error: 'Too many codes requested. Please wait 15 minutes.' }, { status: 429 })
    }
    console.error('[staff/login] error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
