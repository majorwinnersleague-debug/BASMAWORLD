import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'

/**
 * Calendar API — Server-side calendar events (closures, holidays, events)
 * 
 * Stores events in Airtable so they persist across devices and sync
 * between the homepage, teacher portal, and parent portal.
 * 
 * GET  /api/calendar              → list all events
 * POST /api/calendar              → create event (requires teacherCode)
 * DELETE /api/calendar?id=xxx     → delete event (requires teacherCode)
 */

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X' // Summer 2026 Registrations (for enrolled families)

// Calendar events are stored in a dedicated Airtable table
// If this table doesn't exist yet, we fall back to a JSON approach via Vercel KV or file
const CALENDAR_TABLE = process.env.CALENDAR_TABLE_ID || ''

const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || '1515'
const GMAIL_USER = process.env.GMAIL_USER || 'becomeasingermusicacademy@gmail.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''

/* ─── In-memory cache for calendar events (Vercel serverless = ephemeral) ─── */
// When no Airtable table is configured, we store events in the Summer 2026 table
// using a special "Calendar Event" record type, identified by a naming convention.

interface CalendarEvent {
  id: string
  date: string       // YYYY-MM-DD
  endDate?: string   // YYYY-MM-DD (for multi-day closures)
  type: 'closure' | 'holiday' | 'event' | 'early_closure' | 'makeup' | 'break'
  note: string
  reason?: string
  makeupDate?: string
  createdAt: string
  createdBy: string
  notified: boolean
}

/* ─── Airtable-based storage using metadata field ─── */
// We use a special record in the Leads table with a known key to store calendar JSON.
// This is a pragmatic approach that works without creating new Airtable tables.
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const CALENDAR_RECORD_KEY = 'SYSTEM_CALENDAR_EVENTS'

async function loadCalendarEvents(): Promise<CalendarEvent[]> {
  if (!AIRTABLE_PAT) return getDefaultEvents()

  // If a dedicated Calendar table exists, use it
  if (CALENDAR_TABLE) {
    try {
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${CALENDAR_TABLE}?maxRecords=500`
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
        next: { revalidate: 0 },
      })
      if (res.ok) {
        const data = await res.json()
        return (data.records || []).map((r: { id: string; fields: Record<string, string> }) => ({
          id: r.id,
          date: r.fields['Date'] || '',
          endDate: r.fields['End Date'] || undefined,
          type: (r.fields['Type'] || 'closure') as CalendarEvent['type'],
          note: r.fields['Note'] || 'School Closed',
          reason: r.fields['Reason'] || undefined,
          makeupDate: r.fields['Makeup Date'] || undefined,
          createdAt: r.fields['Created At'] || '',
          createdBy: r.fields['Created By'] || '',
          notified: r.fields['Notified'] === 'Yes',
        }))
      }
    } catch (err) {
      console.error('[calendar] Airtable fetch error:', err)
    }
  }

  // Fallback: look for a special system record in Leads table
  try {
    const formula = encodeURIComponent(`{Email}='${CALENDAR_RECORD_KEY}'`)
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=1`
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
      next: { revalidate: 0 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.records?.length > 0) {
        const jsonStr = data.records[0].fields?.['Message'] || '[]'
        try {
          return JSON.parse(jsonStr)
        } catch { /* corrupt data */ }
      }
    }
  } catch (err) {
    console.error('[calendar] Fallback fetch error:', err)
  }

  return getDefaultEvents()
}

async function saveCalendarEvents(events: CalendarEvent[]): Promise<void> {
  if (!AIRTABLE_PAT) return

  // If a dedicated Calendar table exists, use it
  if (CALENDAR_TABLE) {
    // This path creates/updates individual records — handled per-event in POST/DELETE
    return
  }

  // Fallback: store as JSON in a special Leads record
  const jsonStr = JSON.stringify(events)
  const formula = encodeURIComponent(`{Email}='${CALENDAR_RECORD_KEY}'`)
  const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=1`

  try {
    const searchRes = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
    })
    const searchData = await searchRes.json()

    if (searchData.records?.length > 0) {
      // Update existing
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{
            id: searchData.records[0].id,
            fields: { 'Message': jsonStr },
          }],
        }),
      })
    } else {
      // Create new
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{
            fields: {
              'Email': CALENDAR_RECORD_KEY,
              'Full Name': 'System — Calendar Events',
              'Source': 'system',
              'Message': jsonStr,
            },
          }],
        }),
      })
    }
  } catch (err) {
    console.error('[calendar] Save error:', err)
  }
}

function getDefaultEvents(): CalendarEvent[] {
  return [
    { id: 'default-1', date: '2026-07-04', type: 'holiday', note: 'Independence Day — Closed', reason: 'Federal Holiday', createdAt: '2026-01-01', createdBy: 'system', notified: false },
  ]
}

/* ─── Expand date ranges ─── */
function expandDateRange(startDate: string, endDate?: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate + 'T00:00:00')
  const end = endDate ? new Date(endDate + 'T00:00:00') : start
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

/* ─── GET: List all calendar events ─── */
export async function GET() {
  try {
    const events = await loadCalendarEvents()

    // Also build a flat list of all closed dates for easy lookup
    const closedDates: string[] = []
    for (const evt of events) {
      if (evt.type === 'closure' || evt.type === 'holiday' || evt.type === 'break' || evt.type === 'early_closure') {
        closedDates.push(...expandDateRange(evt.date, evt.endDate))
      }
    }

    return NextResponse.json({
      events,
      closedDates: Array.from(new Set(closedDates)).sort(),
    })
  } catch (err) {
    console.error('[calendar] GET error:', err)
    return NextResponse.json({ events: getDefaultEvents(), closedDates: ['2026-07-04'] })
  }
}

/* ─── POST: Create a calendar event ─── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { teacherCode, date, endDate, type, note, reason, makeupDate } = body

    if (teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const events = await loadCalendarEvents()
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date,
      endDate: endDate || undefined,
      type: type || 'closure',
      note: note || 'School Closed',
      reason: reason || undefined,
      makeupDate: makeupDate || undefined,
      createdAt: new Date().toISOString(),
      createdBy: 'teacher',
      notified: false,
    }

    events.push(newEvent)
    await saveCalendarEvents(events)

    // ── Auto-notify affected families ──
    if (body.notify !== false && (type === 'closure' || type === 'holiday' || type === 'break')) {
      try {
        const notifyCount = await notifyAffectedFamilies(newEvent)
        newEvent.notified = true
        // Update the notified flag
        const updatedEvents = events.map(e => e.id === newEvent.id ? { ...e, notified: true } : e)
        await saveCalendarEvents(updatedEvents)
        console.log(`[calendar] Notified ${notifyCount} families about closure on ${date}`)
      } catch (err) {
        console.error('[calendar] Notification error:', err)
      }
    }

    return NextResponse.json({ success: true, event: newEvent })
  } catch (err) {
    console.error('[calendar] POST error:', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

/* ─── DELETE: Remove a calendar event ─── */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { teacherCode, id, date } = body

    if (teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await loadCalendarEvents()
    const filtered = events.filter(e => {
      if (id) return e.id !== id
      if (date) return e.date !== date
      return true
    })

    await saveCalendarEvents(filtered)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[calendar] DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}

/* ─── Notify affected families via email ─── */
async function notifyAffectedFamilies(event: CalendarEvent): Promise<number> {
  if (!AIRTABLE_PAT) return 0

  // Fetch all active paid families from Summer 2026 table
  const formula = encodeURIComponent(`OR({Payment Status}='Paid', {Status}='Active')`)
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?filterByFormula=${formula}&fields[]=Parent%20Email&fields[]=Parent%20Name&fields[]=Student%20Name&fields[]=Class`

  let allRecords: { fields: Record<string, string> }[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)
    const fullUrl = `${url}&${params}`

    const res = await fetch(fullUrl, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
    })
    const data = await res.json()
    allRecords = allRecords.concat(data.records || [])
    offset = data.offset
  } while (offset)

  // Deduplicate by email
  const emailsSent = new Set<string>()
  const transport = getNotifyTransport()
  if (!transport) return 0

  let notified = 0

  for (const record of allRecords) {
    const email = (record.fields['Parent Email'] || '').toLowerCase().trim()
    if (!email || emailsSent.has(email)) continue
    emailsSent.add(email)

    const parentName = record.fields['Parent Name'] || 'Parent'
    const dateRange = event.endDate
      ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
      : formatDate(event.date)

    const html = buildClosureNotificationEmail(parentName, {
      dateRange,
      reason: event.reason || event.note,
      note: event.note,
      makeupDate: event.makeupDate ? formatDate(event.makeupDate) : undefined,
      type: event.type,
    })

    try {
      await transport.sendMail({
        from: `"Become A Singer Music Academy" <${GMAIL_USER}>`,
        to: email,
        subject: `📅 Schedule Update: ${event.note} — BASMA Academy`,
        html,
      })
      notified++
    } catch (err) {
      console.error(`[calendar] Failed to notify ${email}:`, err)
    }
  }

  return notified
}

function getNotifyTransport() {
  if (!GMAIL_APP_PASSWORD) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function buildClosureNotificationEmail(
  parentName: string,
  info: { dateRange: string; reason: string; note: string; makeupDate?: string; type: string }
): string {
  const makeupSection = info.makeupDate
    ? `<div style="background: #f0fdf4; padding: 14px 16px; border-radius: 10px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #166534;">
          ✅ <strong>Makeup Class:</strong> ${info.makeupDate}
        </p>
      </div>`
    : `<div style="background: #fff7ed; padding: 14px 16px; border-radius: 10px; border: 1px solid #fed7aa; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #9a3412;">
          ℹ️ No makeup class has been scheduled at this time. We'll notify you if one is added.
        </p>
      </div>`

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1a0a2e, #4a0e78); padding: 28px 24px; border-radius: 16px 16px 0 0; text-align: center;">
      <div style="font-size: 40px; margin-bottom: 8px;">📅</div>
      <h1 style="color: #ffd700; margin: 0; font-size: 20px; font-weight: 700;">Schedule Update</h1>
      <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Become A Singer Music Academy</p>
    </div>

    <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e5e7eb; border-top: none;">
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 16px;">Hi ${parentName},</p>
      <p style="font-size: 15px; color: #1f2937; margin: 0 0 20px;">We wanted to let you know about an upcoming schedule change:</p>

      <div style="background: #fef2f2; padding: 16px; border-radius: 10px; border: 1px solid #fecaca; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 13px; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
          ${info.type === 'holiday' ? '🏖️ Holiday' : info.type === 'break' ? '📚 School Break' : '🚫 Closure'}
        </p>
        <p style="margin: 0 0 4px; font-size: 16px; color: #1f2937; font-weight: 700;">${info.note}</p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">📅 ${info.dateRange}</p>
        ${info.reason !== info.note ? `<p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">💬 Reason: ${info.reason}</p>` : ''}
      </div>

      ${makeupSection}

      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px;">
        If you have any questions, please don't hesitate to reach out:
      </p>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        📞 <a href="tel:+17027887369" style="color: #7c3aed;">(702) 788-7369</a> ·
        📧 <a href="mailto:becomeasingermusicacademy@gmail.com" style="color: #7c3aed;">Email us</a>
      </p>
    </div>

    <div style="background: #1a0a2e; padding: 16px 24px; border-radius: 0 0 16px 16px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4);">
        Become A Singer Music Academy · <a href="https://basmaworld.com" style="color: #ffd700;">basmaworld.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
