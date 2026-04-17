import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CATEGORIES = [
  'Housing', 'Shelter/Housing', 'Food Support', 'Food Assistance',
  'Mental Health', 'Job Training', 'Healthcare', 'Legal Assistance',
  'Education', 'Transportation', 'Financial', 'Childcare',
  'Employment', 'Crisis Intervention', 'Domestic Violence',
  'Disability Services', 'Immigration Services', 'Veteran Services',
  'Youth Programs', 'Senior Services', 'Family Support',
  'Substance Use', 'Other'
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

    const formula = encodeURIComponent(`FIND("${category}", ARRAYJOIN({Service Type}))>0`)
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
      description: r.fields['Service Description'] || null,
      address: r.fields['Address']
        ? `${r.fields['Address']}, ${r.fields['City'] || ''}, ${r.fields['State'] || ''} ${r.fields['ZIP Code'] || ''}`.trim()
        : null,
      phone: r.fields['Phone'] || null,
      website: r.fields['Website'] || null,
      howToAccess: r.fields['How to Access'] || null,
      mapsLink: r.fields['Address']
        ? `https://maps.google.com/?q=${encodeURIComponent(`${r.fields['Address']}, ${r.fields['City'] || ''}, ${r.fields['State'] || ''}`)}`
        : null,
    }))

    return NextResponse.json({ resources })
  } catch (err) {
    console.error('Resources API error:', err)
    return NextResponse.json({ resources: [], error: 'Internal server error' }, { status: 500 })
  }
}
