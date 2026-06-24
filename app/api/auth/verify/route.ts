import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, createSession } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

/* ── Find parent (same logic as login) ── */
async function findParent(email: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10)
  const formula = encodeURIComponent(`LOWER({Email}) = '${email.toLowerCase().trim()}'`)
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=100`
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  })
  
  if (!res.ok) return null
  const data = await res.json()
  
  for (const record of data.records || []) {
    const recordPhone = (record.fields?.['Phone'] || '').replace(/\D/g, '').slice(-10)
    if (recordPhone === cleanPhone) {
      return {
        id: record.id,
        email: record.fields?.['Email'] || email,
        phone: record.fields?.['Phone'] || phone,
        parentName: record.fields?.['Name'] || record.fields?.['Parent Name'] || '',
      }
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`auth-verify:${ip}`, 10, 5 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 })
  }

  try {
    const { email, phone, code } = await req.json()
    
    if (!email || !phone || !code) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }
    
    // Verify OTP
    const valid = verifyOTP(email, code)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired code. Please try again.' }, { status: 401 })
    }
    
    // Find parent to build session
    const parent = await findParent(email, phone)
    if (!parent) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
    }
    
    // Create session
    await createSession({
      id: parent.id,
      email: parent.email,
      phone: parent.phone,
      parentName: parent.parentName,
      role: 'parent',
    })
    
    return NextResponse.json({
      success: true,
      user: {
        parentName: parent.parentName,
        email: parent.email,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
