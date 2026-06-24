import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'

export async function GET() {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get all lead records for this parent (by email)
    const formula = encodeURIComponent(`LOWER({Email}) = '${user.email.toLowerCase().trim()}'`)
    const leadsUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=100`

    // Also get summer records for extra fields (allergies, medical, emergency)
    const summerFormula = encodeURIComponent(`LOWER({Parent Email}) = '${user.email.toLowerCase().trim()}'`)
    const summerUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?filterByFormula=${summerFormula}&maxRecords=100`

    const [leadsRes, summerRes] = await Promise.all([
      fetch(leadsUrl, { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }, next: { revalidate: 0 } }),
      fetch(summerUrl, { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` }, next: { revalidate: 0 } }),
    ])

    if (!leadsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }

    const leadsData = await leadsRes.json()
    const summerData = summerRes.ok ? await summerRes.json() : { records: [] }

    // Build a lookup from student name → summer record
    const summerByStudent = new Map<string, Record<string, unknown>>()
    for (const r of summerData.records || []) {
      const name = ((r.fields?.['Student Name'] || '') as string).toLowerCase().trim()
      if (name) summerByStudent.set(name, r.fields)
    }

    // Map to student records — each record is one student
    const students = (leadsData.records || []).map((r: { id: string; fields: Record<string, unknown> }) => {
      const sName = (r.fields['Student Name'] || r.fields['studentName'] || '') as string
      const summer = summerByStudent.get(sName.toLowerCase().trim()) || {}

      return {
        id: r.id,
        studentName: sName,
        studentAge: r.fields['Student Age'] || r.fields['studentAge'] || summer['Age'] || '',
        interests: r.fields['Interests'] || r.fields['interests'] || '',
        status: r.fields['Status'] || '',
        enrolledClass: r.fields['Enrolled Class'] || r.fields['enrolledClass'] || summer['Class'] || '',
        timeSlot: r.fields['Time Slot'] || r.fields['timeSlot'] || '',
        discoveryWeek: r.fields['Discovery Week'] || r.fields['discoveryWeek'] || '',
        allergies: summer['Allergies'] || r.fields['Allergies'] || r.fields['allergies'] || 'None',
        medicalConditions: summer['Medical Conditions'] || 'None',
        emergencyContactName: summer['Emergency Contact'] || r.fields['Emergency Contact Name'] || '',
        emergencyContactPhone: summer['Emergency Phone'] || r.fields['Emergency Contact Phone'] || '',
        paymentStatus: r.fields['Payment Status'] || r.fields['paymentStatus'] || summer['Payment Status'] || '',
        createdAt: r.fields['Created'] || r.fields['createdAt'] || '',
        source: r.fields['Source'] || r.fields['source'] || '',
        photoUrl: r.fields['Student Photo'] || summer['Student Photo'] || '',
        liabilityAgreed: (summer['Liability Agreed'] === 'Yes') || (r.fields['Waiver Form'] === 'Complete'),
      }
    })

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
