import { airtableString } from './escape'

/**
 * After a paid private-lesson checkout (Phase 2), best-effort and create-only:
 *
 * 1. Parent login: if BASMA Marketing Leads has no row for this parent email
 *    + student name, create one, so the family can sign in to the parent
 *    portal (login looks up Leads by email + phone). Existing rows are never
 *    changed.
 * 2. Returning families: if the family was already known (Leads, Summer 2026
 *    or Check-In Log), add one row to "Re-Register (June 29+)" linking this
 *    purchase. One row per Stripe session (checked before creating).
 *
 * Never deletes or overwrites anything. Failures are logged, never thrown.
 */

const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const CHECKIN_TABLE = 'tbl7vzQgS5o67kDYv'
const REREGISTER_TABLE = 'tbl6saENxCkEIYyBK'

const text = (v: unknown) => (v === undefined || v === null ? '' : String(v).trim())

export async function linkPaidFamilyInAirtable(args: {
  email: string
  parentName?: string
  phone?: string
  studentName: string
  studentAge?: string
  instrument?: string
  packageName: string
  amountCents: number
  sessionId: string
}): Promise<void> {
  const pat = process.env.AIRTABLE_PAT || ''
  const base = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
  const email = text(args.email).toLowerCase()
  const studentName = text(args.studentName)
  if (!pat || !email || !studentName) return

  const headers = { Authorization: `Bearer ${pat}` }
  const find = async (table: string, formula: string, max = 100) => {
    const url = `https://api.airtable.com/v0/${base}/${table}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=${max}`
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) throw new Error(`Airtable lookup failed (HTTP ${res.status})`)
    return ((await res.json()).records || []) as { id: string; fields: Record<string, unknown> }[]
  }
  const create = async (table: string, fields: Record<string, unknown>) => {
    const res = await fetch(`https://api.airtable.com/v0/${base}/${table}`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ fields }] }),
    })
    if (!res.ok) throw new Error(`Airtable create failed (HTTP ${res.status})`)
  }
  const withoutEmpty = (fields: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== '' && v !== undefined && v !== null))

  try {
    const q = airtableString(email)
    const [leads, summer, checkins] = await Promise.all([
      find(LEADS_TABLE, `LOWER({Email}) = ${q}`),
      find(SUMMER_TABLE, `LOWER({Parent Email}) = ${q}`, 1),
      find(CHECKIN_TABLE, `LOWER({Parent Email}) = ${q}`, 1),
    ])

    // 1. Parent-portal login row (create only if missing for this student).
    const hasStudentRow = leads.some(r =>
      text(r.fields['Email']).toLowerCase() === email &&
      text(r.fields['Student Name']).toLowerCase() === studentName.toLowerCase())
    if (!hasStudentRow) {
      await create(LEADS_TABLE, withoutEmpty({
        'Full Name': text(args.parentName),
        'Email': email,
        'Phone': text(args.phone),
        'Student Name': studentName,
        'Student Age': text(args.studentAge),
        'Interests': text(args.instrument),
        'Source': 'private-lessons-checkout',
      }))
    }

    // 2. Returning family → one Re-Register row per Stripe session.
    const previous = [
      leads.length ? 'BASMA Marketing Leads' : '',
      summer.length ? 'Summer 2026 Registrations' : '',
      checkins.length ? 'Check-In Log' : '',
    ].filter(Boolean)
    if (previous.length) {
      const already = await find(REREGISTER_TABLE, `FIND(${airtableString(args.sessionId)}, {Notes})`, 1)
      if (!already.length) {
        const age = /^\d{1,2}$/.test(text(args.studentAge)) ? Number(text(args.studentAge)) : undefined
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
        await create(REREGISTER_TABLE, withoutEmpty({
          'Student Name': studentName,
          'Parent Name': text(args.parentName),
          'Parent Email': email,
          'Parent Phone': text(args.phone),
          'Age': age,
          'Class': args.packageName,
          'Previous Registration': previous.join(', '),
          'Payment Status': 'Paid',
          'Amount Paid': Math.round(args.amountCents) / 100,
          'Registration Date': today,
          'Notes': `Returning family: paid on basmaworld.com (Stripe ${args.sessionId})`,
        }))
      }
    }
  } catch (error) {
    console.error('[airtable-family] link failed:', error instanceof Error ? error.message : error)
  }
}
