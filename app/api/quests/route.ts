export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const base = process.env.AIRTABLE_ACADEMY_BASE || 'app03QcWnc2irLiE5'
    const token = process.env.AIRTABLE_PAT
    const path = req.nextUrl.searchParams.get('path') // Music, Branding, Health

    if (!token) {
      return NextResponse.json({ quests: [], error: 'Service temporarily unavailable' }, { status: 503 })
    }

    let url = `https://api.airtable.com/v0/${base}/Quests?sort%5B0%5D%5Bfield%5D=XP+Value&sort%5B0%5D%5Bdirection%5D=asc&maxRecords=50`

    if (path && ['Music', 'Branding', 'Health'].includes(path)) {
      const formula = encodeURIComponent(`{Path} = '${path}'`)
      url += `&filterByFormula=${formula}`
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 120 },
    })

    if (!res.ok) {
      console.error('Airtable quests error:', res.status)
      return NextResponse.json({ quests: [] }, { status: 200 })
    }

    const data = await res.json()

    const quests = (data.records || [])
      .filter((r: any) => r.fields['Lesson Name'])
      .map((r: any) => ({
        id: r.id,
        name: r.fields['Lesson Name'],
        path: r.fields['Path'] || 'General',
        xp: r.fields['XP Value'] || 0,
        summary: r.fields['Quest Summary (AI)']?.value || null,
        nextSteps: r.fields['Recommended Next Steps (AI)']?.value || null,
        prerequisite: r.fields['Requirement'] || null,
        unlockStatus: r.fields['Unlock Status'] || 'Locked',
        totalAssigned: r.fields['Total Assigned'] || 0,
      }))

    return NextResponse.json({ quests })
  } catch (err) {
    console.error('Quests API error:', err)
    return NextResponse.json({ quests: [], error: 'Internal server error' }, { status: 500 })
  }
}
