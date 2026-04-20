export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const VALID_NEEDS = [
  'Food', 'Shelter', 'Jobs', 'Mental Health', 'Healthcare',
  'Legal', 'Education', 'Transportation', 'Financial', 'Childcare',
  'Crisis', 'Youth Programs', 'Family Support',
]

// Map user-friendly need names to Airtable Service Type values
const NEED_TO_SERVICE_TYPE: Record<string, string[]> = {
  'Food': ['Food Support', 'Food Assistance'],
  'Shelter': ['Shelter/Housing', 'Housing'],
  'Jobs': ['Employment', 'Job Training'],
  'Mental Health': ['Mental Health', 'Crisis Intervention'],
  'Healthcare': ['Healthcare'],
  'Legal': ['Legal Assistance'],
  'Education': ['Education'],
  'Transportation': ['Transportation'],
  'Financial': ['Financial'],
  'Childcare': ['Childcare'],
  'Crisis': ['Crisis Intervention', 'Domestic Violence'],
  'Youth Programs': ['Youth Programs'],
  'Family Support': ['Family Support'],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { zip, needs } = body

    if (!zip || !needs || !Array.isArray(needs) || needs.length === 0) {
      return NextResponse.json({ error: 'ZIP code and at least one need required' }, { status: 400 })
    }

    // Validate ZIP format
    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json({ error: 'Invalid ZIP code format' }, { status: 400 })
    }

    // Validate needs
    const validNeeds = needs.filter((n: string) => VALID_NEEDS.includes(n))
    if (validNeeds.length === 0) {
      return NextResponse.json({ error: 'No valid needs provided' }, { status: 400 })
    }

    const base = process.env.AIRTABLE_HOPES_BASE
    const token = process.env.AIRTABLE_PAT

    if (!base || !token) {
      return NextResponse.json({ matches: [], error: 'Service temporarily unavailable' }, { status: 503 })
    }

    // Build filter formula for matching service types
    const serviceTypes = validNeeds.flatMap((n: string) => NEED_TO_SERVICE_TYPE[n] || [n])
    const findClauses = serviceTypes.map(
      (st: string) => `FIND("${st}", ARRAYJOIN({Service Type})) > 0`
    )
    const formula = encodeURIComponent(`AND(OR(${findClauses.join(',')}), {Status} = 'Active')`)

    const url = `https://api.airtable.com/v0/${base}/Services?filterByFormula=${formula}&maxRecords=20`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.error('Airtable navigator error:', res.status)
      return NextResponse.json({ matches: [] }, { status: 200 })
    }

    const data = await res.json()

    const matches = (data.records || []).map((r: any) => {
      const fields = r.fields
      const address = fields['Address']
        ? `${fields['Address']}, ${fields['City'] || ''}, ${fields['State'] || ''} ${fields['ZIP Code'] || ''}`.trim()
        : null

      return {
        id: r.id,
        name: fields['Organization Name'] || 'Unknown',
        type: fields['Service Type'] || [],
        description: fields['Service Description'] || null,
        address,
        city: fields['City'] || null,
        zip: fields['ZIP Code'] || null,
        phone: fields['Phone'] || null,
        website: fields['Website'] || null,
        cost: fields['Cost'] || null,
        eligibility: fields['Eligibility'] || null,
        hours: {
          monday: fields['Hours Monday'] || null,
          tuesday: fields['Hours Tuesday'] || null,
          wednesday: fields['Hours Wednesday'] || null,
          thursday: fields['Hours Thursday'] || null,
          friday: fields['Hours Friday'] || null,
          saturday: fields['Hours Saturday'] || null,
          sunday: fields['Hours Sunday'] || null,
        },
        rating: fields['Average Rating'] || null,
        mapsLink: address
          ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
          : null,
        distance: null, // Future: calculate from ZIP
      }
    })

    return NextResponse.json({
      matches,
      zip,
      needsMatched: validNeeds,
      message: matches.length > 0
        ? `Major Winners League found ${matches.length} resource${matches.length > 1 ? 's' : ''} near you!`
        : 'No resources found for your area yet. We\'re growing — check back soon!',
    })
  } catch (err) {
    console.error('Navigator API error:', err)
    return NextResponse.json({ matches: [], error: 'Internal server error' }, { status: 500 })
  }
}
