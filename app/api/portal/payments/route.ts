import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const PAYMENTS_TABLE = 'tblfTQQEciBFqovYU'

export async function GET() {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get payments for this parent by email
    const formula = encodeURIComponent(`LOWER({Email}) = '${user.email.toLowerCase().trim()}'`)
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${PAYMENTS_TABLE}?filterByFormula=${formula}&maxRecords=100&sort[0][field]=Created&sort[0][direction]=desc`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      // Table might not have records yet, return empty
      return NextResponse.json({ payments: [] })
    }

    const data = await res.json()

    const payments = (data.records || []).map((r: { id: string; fields: Record<string, unknown> }) => ({
      id: r.id,
      amount: r.fields['Amount'] || r.fields['amount'] || 0,
      status: r.fields['Status'] || r.fields['status'] || '',
      description: r.fields['Description'] || r.fields['description'] || '',
      studentName: r.fields['Student Name'] || r.fields['studentName'] || '',
      className: r.fields['Class Name'] || r.fields['className'] || '',
      days: r.fields['Days'] || r.fields['days'] || '',
      stripeSessionId: r.fields['Stripe Session ID'] || '',
      createdAt: r.fields['Created'] || r.fields['createdAt'] || '',
    }))

    return NextResponse.json({ payments })
  } catch {
    return NextResponse.json({ payments: [] })
  }
}
