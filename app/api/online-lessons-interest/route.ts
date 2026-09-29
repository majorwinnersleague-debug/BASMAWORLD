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
    const returning = historical.some((records, i) => records.some(r => {
      const f=r.fields || {}
      const re=email(String(i===1 ? (f.Email||f.email||'') : i===2 ? (f['Parent Email']||'') : i===3 ? (f['Parent Email']||'') : (f.Email||'')))
      const rp=phone(String(i===2 ? (f['Parent Phone']||'') : i===3 ? (f['Parent Phone']||'') : (f.Phone||'')))
      return re===e || (!!pd && pd===rp)
    }))

    const status = returning ? 'Returning' : 'New'

    // Reuse an existing master-list record when the person is already in BASMA Marketing Leads.
    // This keeps the master list clean instead of creating duplicate people.
    const existing = leadRecords.find(r => {
      const f = r.fields || {}
      const existingEmail = email(String(f.Email || ''))
      const existingPhone = phone(String(f.Phone || ''))
      return existingEmail === e || (!!pd && pd === existingPhone)
    })

    const fields: Record<string, any> = {
      'Full Name': name || String(existing?.fields?.['Full Name'] || ''),
      Email: e,
      Phone: p || String(existing?.fields?.Phone || ''),
      Source: existing?.fields?.Source || 'Online Lessons Interest',
      Status: status,
      'Lesson Type': existing?.fields?.['Lesson Type'] || 'Private',
      'Online Interest': true,
      Message: existing?.fields?.Message || `Online Lessons Interest | Status: ${status}`,
    }
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}${existing ? `/${existing.id}` : ''}`, {
      method: existing ? 'PATCH' : 'POST',
      headers:{ Authorization:`Bearer ${AIRTABLE_PAT}`, 'Content-Type':'application/json' },
      body: JSON.stringify(existing ? { fields } : { records: [{ fields }] }),
    })
    if (!res.ok) { console.error('Airtable online interest create failed:', await res.text()); return NextResponse.json({ error:'We could not save your request. Please try again.' }, { status:500 }) }
    return NextResponse.json({ success:true })
  } catch (error) {
    console.error('Online lesson interest error:', error)
    return NextResponse.json({ error:'Something went wrong. Please try again.' }, { status:500 })
  }
}
