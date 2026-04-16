import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CATEGORIES = [
  'Housing', 'Food Support', 'Mental Health', 'Job Training',
  'Healthcare', 'Legal', 'Education', 'Transportation',
  'Financial', 'Childcare', 'Employment', 'Crisis Intervention',
  'Domestic Violence', 'Disability Services', 'Immigration Services',
  'Veteran Services', 'Youth Programs', 'Senior Services', 'Other'
]

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category')

    if (!category) {
      return NextResponse.json({ error: 'category parameter required' }, { status: 400 })
    }

    // Security: whitelist categories to prevent formula injection
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const base = process.env.AIRTABLE_HOPES_BASE
    const token = process.env.AIRTABLE_PAT

    if (!base || !token) {
      console.error('Missing Airtable env vars')
      return NextResponse.json({ resources: [], error: 'Service temporarily unavailable' }, { status: 503 })
    }

    const formula = encodeURIComponent(`FIND("${category}", {Category})>0`)
    const res = await fetch(
      `https://api.airtable.com/v0/${base}/Services?filterByFormula=${formula}&maxRecords=10`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 300 } }
    )

    if (!res.ok) {
      console.error('Airtable error:', res.status)
      return NextResponse.json({ resources: [] }, { status: 200 })
    }

    const data = await res.json()

    const resources = (data.records || []).map((r: any) => ({
      name: r.fields['Organization Name'] || 'Unknown Organization',
      address: r.fields['Address'] || null,
      phone: r.fields['Phone'] || null,
      website: r.fields['Website'] || null,
      howToAccess: r.fields['How to Access'] || null,
      mapsLink: r.fields['Address']
        ? `https://maps.google.com/?q=${encodeURIComponent(r.fields['Address'])}`
        : null,
    }))

    return NextResponse.json({ resources })
  } catch (err) {
    console.error('Resources API error:', err)
    return NextResponse.json({ resources: [], error: 'Internal server error' }, { status: 500 })
  }
}
