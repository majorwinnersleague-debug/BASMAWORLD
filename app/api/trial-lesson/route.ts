import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { checkRateLimit, getClientIp, isValidEmail, sanitizeString } from '@/lib/rate-limit'
import { sendResendEmail } from '@/lib/auth-email'
import { escapeHtml } from '@/lib/escape'

/**
 * POST /api/trial-lesson — free 15-minute trial lesson request (Phase 1).
 *
 * - Always available, no payment, one per student (same parent email +
 *   student name). A repeat request is acknowledged without a new record.
 * - Recorded in Neon `lesson_requests` (package_id 'trial-15min', $0,
 *   status 'Trial Requested'), so it appears in the teacher portal's
 *   Database tab next to paid requests.
 * - Emails the academy inbox, and confirms to the parent.
 * Replaces the retired free 20-minute endpoint (/api/private-lesson).
 */

const ACADEMY_INBOX = 'becomeasingermusicacademy@gmail.com'
const TRIAL_PACKAGE_ID = 'trial-15min'
const TRIAL_PACKAGE_NAME = 'Free 15-Minute Trial Lesson'

function field(value: unknown, max: number): string {
  return typeof value === 'string' || typeof value === 'number'
    ? sanitizeString(String(value), max).trim()
    : ''
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`trial-lesson:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '600' } }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parentName = field(body.parentName, 100)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : ''
  const phone = field(body.phone, 40)
  const studentName = field(body.studentName, 100)
  const studentAge = field(body.studentAge, 10)
  const instrument = field(body.instrument, 60)
  const preferredDay = field(body.preferredDay, 40) || 'Flexible'
  const preferredTime = field(body.preferredTime, 40) || 'Flexible'
  const notes = field(body.notes, 1000)

  if (!parentName || !email || !phone || !studentName) {
    return NextResponse.json({ error: 'Please fill in parent name, email, phone and student name.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!sql) {
    return NextResponse.json(
      { error: 'Trial requests are temporarily unavailable. Please call (702) 788-7369.' },
      { status: 503 }
    )
  }

  try {
    // One free trial per student.
    const existing = await sql`
      SELECT id FROM lesson_requests
      WHERE package_id = ${TRIAL_PACKAGE_ID}
        AND LOWER(email) = ${email}
        AND LOWER(student_name) = ${studentName.toLowerCase()}
      LIMIT 1
    `
    if (existing.length > 0) {
      return NextResponse.json({ success: true, alreadyRequested: true })
    }

    await sql`
      INSERT INTO lesson_requests (
        parent_name, email, phone, student_name, student_age, instrument,
        preferred_day, preferred_time, notes, package_id, package_name, amount_cents, status
      ) VALUES (
        ${parentName}, ${email}, ${phone}, ${studentName}, ${studentAge || null}, ${instrument || null},
        ${preferredDay}, ${preferredTime}, ${notes || null},
        ${TRIAL_PACKAGE_ID}, ${TRIAL_PACKAGE_NAME}, 0, 'Trial Requested'
      )
    `
  } catch (error) {
    console.error('[trial-lesson] Neon save failed:', error)
    return NextResponse.json(
      { error: 'We could not save your request. Please try again or call (702) 788-7369.' },
      { status: 500 }
    )
  }

  const e = escapeHtml
  // Notify the academy (best-effort; the request is already saved).
  await sendResendEmail({
    to: ACADEMY_INBOX,
    subject: `🎵 Free trial request: ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px;">
        <h2 style="color:#4a0e78;">New free 15-minute trial request</h2>
        <p><strong>Parent:</strong> ${e(parentName)}</p>
        <p><strong>Email:</strong> ${e(email)}</p>
        <p><strong>Phone:</strong> ${e(phone)}</p>
        <p><strong>Student:</strong> ${e(studentName)}${studentAge ? ` (age ${e(studentAge)})` : ''}</p>
        <p><strong>Instrument:</strong> ${e(instrument || 'Not specified')}</p>
        <p><strong>Preferred:</strong> ${e(preferredDay)} at ${e(preferredTime)}</p>
        ${notes ? `<p><strong>Notes:</strong> ${e(notes)}</p>` : ''}
        <p style="color:#666;font-size:13px;">Also listed in the teacher portal → Database tab (status "Trial Requested").</p>
      </div>
    `,
  })

  // Confirm to the parent (best-effort).
  await sendResendEmail({
    to: email,
    subject: 'Your free BASMA trial lesson request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px;">
        <h2 style="color:#4a0e78;">Thanks, ${e(parentName)}!</h2>
        <p>We received your request for a <strong>free 15-minute trial lesson</strong> for ${e(studentName)}.</p>
        <p>We'll contact you shortly to schedule it. Questions? Call (702) 788-7369.</p>
        <p style="color:#666;font-size:13px;">BASMA Music Academy</p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
