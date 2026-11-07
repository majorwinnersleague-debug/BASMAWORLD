import { NextResponse } from 'next/server'
import { getStaffSession, staffUnauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()
  return NextResponse.json({ user: staff })
}
