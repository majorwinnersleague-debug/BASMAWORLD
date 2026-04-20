export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const base = process.env.AIRTABLE_ACADEMY_BASE || 'app03QcWnc2irLiE5'
    const token = process.env.AIRTABLE_PAT

    if (!token) {
      return NextResponse.json({ players: [], error: 'Service temporarily unavailable' }, { status: 503 })
    }

    const url = `https://api.airtable.com/v0/${base}/Players?sort%5B0%5D%5Bfield%5D=Total+XP&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=50`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Airtable leaderboard error:', res.status)
      return NextResponse.json({ players: [] }, { status: 200 })
    }

    const data = await res.json()

    const players = (data.records || [])
      .filter((r: any) => r.fields['Name'])
      .map((r: any, i: number) => ({
        rank: i + 1,
        name: r.fields['Name'] || 'Unknown',
        xp: r.fields['Total XP'] || 0,
        level: r.fields['Level'] || 1,
        characterClass: r.fields['Character Class'] || 'Newcomer',
        currentLevel: r.fields['Current Level'] || 'Level 1: Novice ⭐',
        completedQuests: r.fields['Completed Quests Count'] || 0,
        characterArt: r.fields['Character Art']?.[0]?.thumbnails?.large?.url || null,
      }))

    return NextResponse.json({ players })
  } catch (err) {
    console.error('Leaderboard API error:', err)
    return NextResponse.json({ players: [], error: 'Internal server error' }, { status: 500 })
  }
}
