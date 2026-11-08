import { NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const TABLES = ['tblelNWN2hed8OclX', 'tblfTQQEciBFqovYU', 'tblfOnRDkfgZoCF9X', 'tbl7vzQgS5o67kDYv']

async function fetchAllRecords(tableId: string) {
  const records: { id: string; fields: Record<string, any> }[] = []
  let offset = ''
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}`)
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }, cache: 'no-store' })
    if (!res.ok) throw new Error('Airtable lookup failed')
    const data = await res.json()
    records.push(...(data.records || []))
    offset = data.offset || ''
  } while (offset)
  return records
}
function email(v: string) { return v.trim().toLowerCase() }
function phone(v: string) { const d=v.replace(/\D/g,''); return d.length===11&&d.startsWith('1')?d.slice(1):d }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const e = email(body.email || '')
    const name = String(body.name || '').trim()
    const p = String(body.phone || '').trim()
    if (!e || !e.includes('@')) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (!AIRTABLE_PAT) return NextResponse.json({ error: 'Online lesson interest is temporarily unavailable.' }, { status: 503 })

    const [leadRecords, ...historicalTables] = await Promise.all([fetchAllRecords(LEADS_TABLE), ...TABLES.map(fetchAllRecords)])
    const historical = [leadRecords, ...historicalTables]
    const pd = phone(p)
    // Email/phone field names per table, from the verified Airtable schema.
    // (The old index-based lookup read fields that do not exist in Stripe
    // Payments and Check-In Log, so some returning families were missed.)
    const tableIds = [LEADS_TABLE, ...TABLES]
    const CONTACT_FIELDS: Record<string, { email: string; phone: string }> = {
      tbl1diIEhM9MtKViE: { email: 'Email', phone: 'Phone' },               // BASMA Marketing Leads
      tblelNWN2hed8OclX: { email: 'Email', phone: 'Phone' },               // Enrollments
      tblfTQQEciBFqovYU: { email: 'Email', phone: 'Phone' },               // Stripe Payments
      tblfOnRDkfgZoCF9X: { email: 'Parent Email', phone: 'Parent Phone' }, // Summer 2026 Registrations
      tbl7vzQgS5o67kDYv: { email: 'Parent Email', phone: 'Parent Phone' }, // Check-In Log
    }
    const returning = historical.some((records, i) => {
      const cf = CONTACT_FIELDS[tableIds[i]]
      return records.some(r => {
        const f = r.fields || {}
        const re = email(String(f[cf.email] || ''))
        const rp = phone(String(f[cf.phone] || ''))
        return re === e || (!!pd && pd === rp)
      })
    })

    const status = returning ? 'Returning' : 'New'
    const note = `Online Lessons Interest | Status: ${status}`

    // Reuse an existing master-list record only when its stored Email matches
    // this email. A phone-only match is not treated as the same family.
    const existing = leadRecords.find(r => email(String(r.fields?.Email || '')) === e)

    let res: Response | null = null
    if (existing) {
      // Never replace existing values: only fill fields that are currently empty.
      // Status and Email of an existing record are never changed here.
      // ("Lesson Type" and "Online Interest" are not Airtable fields; sending
      // them made every save fail.)
      const current = existing.fields || {}
      const candidates: Record<string, string> = {
        'Full Name': name,
        Phone: p,
        Source: 'Online Lessons Interest',
        Message: note,
      }
      const fields: Record<string, string> = {}
      for (const [k, v] of Object.entries(candidates)) {
        if (v && !String(current[k] ?? '').trim()) fields[k] = v
      }
      if (Object.keys(fields).length > 0) {
        res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}/${existing.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields }),
        })
      }
    } else {
      // New person: one new record with verified Leads fields only.
      const fields: Record<string, string> = {
        Email: e,
        Source: 'Online Lessons Interest',
        Status: status,
        Message: note,
      }
      if (name) fields['Full Name'] = name
      if (p) fields['Phone'] = p
      res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: [{ fields }] }),
      })
    }
    if (res && !res.ok) { console.error('Airtable online interest save failed: HTTP', res.status); return NextResponse.json({ error:'We could not save your request. Please try again.' }, { status:500 }) }
    return NextResponse.json({ success:true })
  } catch (error) {
    console.error('Online lesson interest error:', error)
    return NextResponse.json({ error:'Something went wrong. Please try again.' }, { status:500 })
  }
}
