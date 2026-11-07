import { NextRequest, NextResponse } from 'next/server'
import { issueLoginCode, OtpRateLimitError } from '@/lib/otp'
import { findParent } from '@/lib/parent-lookup'
import { sendLoginCodeEmail } from '@/lib/auth-email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * Parent portal login, step 1: email + phone → emailed 6-digit code.
 * There is NO fallback: if the code can't be emailed, nobody is logged in.
 */
export async function POST(req: NextRequest) {
  // Rate limit: 3 login attempts per IP per 5 minutes (per instance; the
  // per-email limit in lib/otp.ts is enforced in Neon across instances).
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`auth-login:${ip}`, 3, 5 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  try {
    const { email, phone } = await req.json()

    if (!email || !phone || typeof email !== 'string' || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Email and phone number are required.' }, { status: 400 })
    }

    const parent = await findParent(email, phone)
    if (!parent) {
      return NextResponse.json(
        { error: 'No account found with this email and phone number. Please contact the academy for help.' },
        { status: 404 }
      )
    }

    const code = await issueLoginCode(email, 'parent')
    const sent = await sendLoginCodeEmail({ to: email.trim(), code, name: parent.parentName, portal: 'Parent Portal' })

    if (!sent) {
      return NextResponse.json(
        { error: "We couldn't send your login code right now. Please try again later or contact the academy." },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      parentName: parent.parentName,
    })
  } catch (error) {
    if (error instanceof OtpRateLimitError) {
      return NextResponse.json(
        { error: 'Too many codes requested. Please wait 15 minutes and try again.' },
        { status: 429 }
      )
    }
    console.error('[auth/login] error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
