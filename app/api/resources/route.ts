import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  if (!category) return NextResponse.json({ error: 'category required' }, { status: 400 })

  const base = process.env.AIRTABLE_HOPES_BASE
  const token = process.env.AIRTABLE_PAT
  const formula = encodeURIComponent(`{Category}='${category}'`)

  const res = await fetch(
    `https://api.airtable.com/v0/${base}/Services?filterByFormula=${formula}&maxRecords=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()

  const resources = data.records?.map((r: any) => ({
    name: r.fields['Organization Name'],
    address: r.fields['Address'],
    phone: r.fields['Phone'],
    website: r.fields['Website'],
    howToAccess: r.fields['How to Access'],
    mapsLink: r.fields['Address'] ? `https://maps.google.com/?q=${encodeURIComponent(r.fields['Address'])}` : null,
  })) || []

  return NextResponse.json({ resources })
}
