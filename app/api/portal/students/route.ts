import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

export async function GET() {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get all records for this parent (by email)
    const formula = encodeURIComponent(`LOWER({Email}) = '${user.email.toLowerCase().trim()}'`)
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=100`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    const data = await res.json()

    // Map to student records — each record is one student
    const students = (data.records || []).map((r: { id: string; fields: Record<string, unknown> }) => ({
      id: r.id,
      studentName: r.fields['Student Name'] || r.fields['studentName'] || '',
      studentAge: r.fields['Student Age'] || r.fields['studentAge'] || '',
      interests: r.fields['Interests'] || r.fields['interests'] || '',
      status: r.fields['Status'] || '',
      enrolledClass: r.fields['Enrolled Class'] || r.fields['enrolledClass'] || '',
      timeSlot: r.fields['Time Slot'] || r.fields['timeSlot'] || '',
      discoveryWeek: r.fields['Discovery Week'] || r.fields['discoveryWeek'] || '',
      allergies: r.fields['Allergies'] || r.fields['allergies'] || 'None',
      emergencyContactName: r.fields['Emergency Contact Name'] || r.fields['emergencyContactName'] || '',
      emergencyContactPhone: r.fields['Emergency Contact Phone'] || r.fields['emergencyContactPhone'] || '',
      paymentStatus: r.fields['Payment Status'] || r.fields['paymentStatus'] || '',
      createdAt: r.fields['Created'] || r.fields['createdAt'] || '',
      source: r.fields['Source'] || r.fields['source'] || '',
    }))

    return NextResponse.json({
      parentName: user.parentName,
      email: user.email,
      phone: user.phone,
      students,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
