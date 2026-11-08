import { sendResendEmail } from './auth-email'
import { escapeHtml } from './escape'
import { CANCEL_CUTOFF_HOURS, STUDIO_LOCATION } from './schedule-policy'
import { formatInstant } from './tz'
import type { BookingView } from './schedule'

const ACADEMY_INBOX = 'becomeasingermusicacademy@gmail.com'
const SITE = 'https://basmaworld.com'

function gcalDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function calendarLink(b: BookingView): string {
  const title = b.kind === 'trial' ? `BASMA free trial lesson — ${b.studentName}` : `BASMA ${b.minutes}-min lesson — ${b.studentName}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${gcalDate(b.startsAt)}/${gcalDate(b.endsAt)}`,
    location: STUDIO_LOCATION,
    details: `Questions or changes: (702) 788-7369 · ${SITE}/portal`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function what(b: BookingView): string {
  return b.kind === 'trial' ? 'Free 15-minute trial lesson' : `${b.minutes}-minute private lesson`
}

/** Confirmation to the parent and a notice to the academy. Best-effort. */
export async function sendBookingConfirmation(b: BookingView): Promise<void> {
  const e = escapeHtml
  const when = formatInstant(new Date(b.startsAt))
  await sendResendEmail({
    to: b.guardianEmail,
    subject: `Booked: ${what(b)} for ${b.studentName} — ${when}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px;">
        <h2 style="color:#4a0e78;">You're booked! 🎵</h2>
        <p><strong>${e(what(b))}</strong> for <strong>${e(b.studentName)}</strong></p>
        <p style="font-size:18px;"><strong>${e(when)}</strong> (Pacific time)</p>
        <p>📍 ${e(STUDIO_LOCATION)}</p>
        <p><a href="${e(calendarLink(b))}" style="display:inline-block;background:#4a0e78;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;">Add to Google Calendar</a></p>
        <p style="color:#555;font-size:13px;">Need to change it? Cancel in the Parent Portal (${SITE}/portal) up to ${CANCEL_CUTOFF_HOURS} hours before${b.kind === 'lesson' ? ' and your lesson credit comes back' : ''}. Later than that, call (702) 788-7369.</p>
        <p style="color:#888;font-size:12px;">BASMA Music Academy</p>
      </div>
    `,
  })
  await sendResendEmail({
    to: ACADEMY_INBOX,
    subject: `📅 New booking: ${b.studentName} — ${when}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p><strong>${e(what(b))}</strong> — ${e(when)}</p>
        <p>Student: ${e(b.studentName)}<br>Parent: ${e(b.guardianName || '')} · ${e(b.guardianEmail)} · ${e(b.guardianPhone || '')}</p>
        <p><a href="${SITE}/teacher/schedule">Open the schedule</a></p>
      </div>
    `,
  })
}

/** Cancellation notice to the parent and the academy. Best-effort. */
export async function sendCancellationNotice(b: BookingView, creditReturned: boolean): Promise<void> {
  const e = escapeHtml
  const when = formatInstant(new Date(b.startsAt))
  await sendResendEmail({
    to: b.guardianEmail,
    subject: `Cancelled: ${what(b)} for ${b.studentName} — ${when}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px;">
        <h2 style="color:#4a0e78;">Booking cancelled</h2>
        <p>${e(what(b))} for ${e(b.studentName)} on <strong>${e(when)}</strong> has been cancelled.</p>
        ${b.kind === 'lesson' ? `<p>${creditReturned ? 'Your lesson credit has been returned — book a new time any time in the Parent Portal.' : 'This lesson credit was not returned. Questions? Call (702) 788-7369.'}</p>` : ''}
        <p><a href="${SITE}/portal">Open the Parent Portal</a></p>
      </div>
    `,
  })
  await sendResendEmail({
    to: ACADEMY_INBOX,
    subject: `❌ Booking cancelled: ${b.studentName} — ${when}`,
    html: `<div style="font-family: Arial, sans-serif;"><p>${e(what(b))} — ${e(when)}<br>${e(b.studentName)} · ${e(b.guardianEmail)}${b.kind === 'lesson' ? `<br>Credit returned: ${creditReturned ? 'yes' : 'no'}` : ''}</p></div>`,
  })
}
