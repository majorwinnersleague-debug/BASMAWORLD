import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'

async function airtableGet(table: string, formula: string) {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}`)
  url.searchParams.set('filterByFormula', formula)
  url.searchParams.set('pageSize', '100')
  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  return data.records || []
}

async function airtablePatch(table: string, recordId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })
  return res.json()
}

async function airtableCreate(table: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }] }),
  })
  return res.json()
}

async function airtableDelete(table: string, recordId: string) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}/${recordId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  return res.json()
}

// GET — Look up family by email
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Search both tables
  const escapedEmail = email.replace(/"/g, '\\"')
  const [leadsRecords, summerRecords] = await Promise.all([
    airtableGet(LEADS_TABLE, `LOWER({Email})="${escapedEmail}"`),
    airtableGet(SUMMER_TABLE, `LOWER({Parent Email})="${escapedEmail}"`),
  ])

  if (leadsRecords.length === 0 && summerRecords.length === 0) {
    return NextResponse.json({ found: false, students: [] })
  }

  // Build unified student list
  interface StudentRecord {
    id: string;
    table: string;
    studentName: string;
    studentAge: string;
    parentName: string;
    email: string;
    phone: string;
    interests: string;
    allergies: string;
    medicalConditions: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    hasWaiver: boolean;
    isDuplicate: boolean;
  }

  const students: StudentRecord[] = []
  const seenStudentNames = new Map<string, number>() // name → count

  for (const r of leadsRecords) {
    const f = r.fields
    const name = (f['Student Name'] || '').trim()
    if (!name) continue

    const count = (seenStudentNames.get(name.toLowerCase()) || 0) + 1
    seenStudentNames.set(name.toLowerCase(), count)

    students.push({
      id: r.id,
      table: 'leads',
      studentName: name,
      studentAge: f['Student Age'] || '',
      parentName: f['Full Name'] || '',
      email: f['Email'] || '',
      phone: f['Phone'] || '',
      interests: f['Interests'] || '',
      allergies: '',
      medicalConditions: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      hasWaiver: f['Waiver Form'] === 'Complete',
      isDuplicate: false,
    })
  }

  // Enrich from Summer table
  for (const r of summerRecords) {
    const f = r.fields
    const name = (f['Student Name'] || '').trim()
    // Find matching leads record
    const match = students.find(s => s.studentName.toLowerCase() === name.toLowerCase())
    if (match) {
      match.allergies = f['Allergies'] || match.allergies
      match.medicalConditions = f['Medical Conditions'] || match.medicalConditions
      match.emergencyContactName = f['Emergency Contact'] || match.emergencyContactName
      match.emergencyContactPhone = f['Emergency Phone'] || match.emergencyContactPhone
      if (f['Liability Agreed'] === 'Yes') match.hasWaiver = true
    }
  }

  // Mark duplicates
  for (const s of students) {
    const count = seenStudentNames.get(s.studentName.toLowerCase()) || 0
    if (count > 1) s.isDuplicate = true
  }

  // Get parent info from first record
  const firstLead = leadsRecords[0]?.fields || {}
  const firstSummer = summerRecords[0]?.fields || {}

  return NextResponse.json({
    found: true,
    parentName: firstLead['Full Name'] || firstSummer['Parent Name'] || '',
    email: firstLead['Email'] || firstSummer['Parent Email'] || '',
    phone: firstLead['Phone'] || firstSummer['Parent Phone'] || '',
    students,
    totalLeadsRecords: leadsRecords.length,
    totalSummerRecords: summerRecords.length,
  })
}

// POST — Add a new sibling
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, parentName, phone, studentName, studentAge, interests } = data

    if (!email || !studentName) {
      return NextResponse.json({ error: 'Email and student name required' }, { status: 400 })
    }

    // Create in Marketing Leads
    const leadsResult = await airtableCreate(LEADS_TABLE, {
      'Full Name': parentName || '',
      'Email': email,
      'Phone': phone || '',
      'Student Name': studentName,
      'Student Age': studentAge || '',
      'Interests': interests || '',
      'Source': 'family-portal-add-sibling',
      'Status': 'New Lead',
      'Registration Form': 'Partial',
      'Waiver Form': 'Not Started',
    })

    // Also create in Summer table
    await airtableCreate(SUMMER_TABLE, {
      'Parent Name': parentName || '',
      'Parent Email': email,
      'Parent Phone': phone || '',
      'Student Name': studentName,
      'Age': studentAge ? parseInt(studentAge) : undefined,
      'Class': '',
      'Payment Status': 'Free',
      'Notes': 'Added via family portal (sibling)',
    })

    return NextResponse.json({
      success: true,
      newRecordId: leadsResult.records?.[0]?.id,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// PATCH — Update a student's info
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { recordId, studentName, studentAge, interests, allergies, medicalConditions, emergencyContactName, emergencyContactPhone, parentName, phone, email: newEmail, teacherCode } = data

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID required' }, { status: 400 })
    }

    // If teacherCode is provided, verify it
    const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || '1515'
    if (teacherCode && teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ error: 'Invalid teacher code' }, { status: 403 })
    }

    // Update Marketing Leads
    const leadsFields: Record<string, unknown> = {}
    if (studentName !== undefined) leadsFields['Student Name'] = studentName
    if (studentAge !== undefined) leadsFields['Student Age'] = studentAge
    if (interests !== undefined) leadsFields['Interests'] = interests
    if (parentName !== undefined) leadsFields['Full Name'] = parentName
    if (phone !== undefined) leadsFields['Phone'] = phone
    if (newEmail !== undefined) leadsFields['Email'] = newEmail

    if (Object.keys(leadsFields).length > 0) {
      await airtablePatch(LEADS_TABLE, recordId, leadsFields)
    }

    // Also update Summer table if health/safety data provided
    if (allergies !== undefined || medicalConditions !== undefined || emergencyContactName !== undefined || emergencyContactPhone !== undefined) {
      // Find matching summer record
      const escapedName = (studentName || '').replace(/"/g, '\\"')
      const summerRecs = await airtableGet(SUMMER_TABLE, `{Student Name}="${escapedName}"`)
      if (summerRecs.length > 0) {
        const summerFields: Record<string, unknown> = {}
        if (allergies !== undefined) summerFields['Allergies'] = allergies
        if (medicalConditions !== undefined) summerFields['Medical Conditions'] = medicalConditions
        if (emergencyContactName !== undefined) summerFields['Emergency Contact'] = emergencyContactName
        if (emergencyContactPhone !== undefined) summerFields['Emergency Phone'] = emergencyContactPhone
        await airtablePatch(SUMMER_TABLE, summerRecs[0].id, summerFields)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// DELETE — Remove a duplicate record
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()
    const { recordId } = data

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID required' }, { status: 400 })
    }

    await airtableDelete(LEADS_TABLE, recordId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
