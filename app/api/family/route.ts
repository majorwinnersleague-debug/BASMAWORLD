import { NextRequest, NextResponse } from 'next/server'
import { getStaffSession, staffUnauthorized } from '@/lib/auth'
import { airtableString } from '@/lib/escape'

/**
 * /api/family — staff only (teacher portal). The public /family page is
 * redirected to /, so every method now requires a signed staff session.
 * Previously GET leaked family PII by email, and PATCH/DELETE let anyone
 * change login email/phone or delete records.
 */
export const dynamic = 'force-dynamic'

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
  // Previously failures were ignored and the route still reported success.
  if (!res.ok) throw new Error(`Airtable update failed (HTTP ${res.status})`)
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
  if (!res.ok) throw new Error(`Airtable create failed (HTTP ${res.status})`)
  return res.json()
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function ageText(value: unknown): string {
  return text(value)
}

// Returns candidate values only for fields that are currently empty.
// Existing non-empty values are never replaced.
function fillEmptyOnly(
  current: Record<string, unknown>,
  candidates: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [field, value] of Object.entries(candidates)) {
    if (value && !text(current[field])) out[field] = value
  }
  return out
}

// Reads one existing Leads record (read-only). Returns null if it cannot be read.
async function airtableGetRecord(table: string, recordId: string) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}/${recordId}`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json() as Promise<{ id: string; fields: Record<string, unknown> }>
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
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()

  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Search both tables
  const [leadsRecords, summerRecords] = await Promise.all([
    airtableGet(LEADS_TABLE, `LOWER({Email})=${airtableString(email)}`),
    airtableGet(SUMMER_TABLE, `LOWER({Parent Email})=${airtableString(email)}`),
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
      // Leads is the source of truth; Summer only fills gaps below.
      allergies: f['Allergies'] || '',
      medicalConditions: f['Medical Conditions'] || '',
      emergencyContactName: f['Emergency Contact Name'] || '',
      emergencyContactPhone: f['Emergency Contact Phone'] || '',
      hasWaiver: f['Waiver Form'] === 'Complete',
      isDuplicate: false,
    })
  }

  // Enrich from Summer table
  for (const r of summerRecords) {
    const f = r.fields
    // Identity check 1: this Summer record's own parent email must equal the
    // normalized email being looked up (not just trusted from the filter).
    if (text(f['Parent Email']).toLowerCase() !== email) continue
    const name = text(f['Student Name']).toLowerCase()
    if (!name) continue
    // Identity check 2: a Leads student with the same normalized name AND the
    // same normalized parent email. If either check fails, nothing is used.
    const match = students.find(s =>
      s.studentName.trim().toLowerCase() === name &&
      text(s.email).toLowerCase() === email
    )
    if (match) {
      match.allergies = match.allergies || f['Allergies'] || ''
      match.medicalConditions = match.medicalConditions || f['Medical Conditions'] || ''
      match.emergencyContactName = match.emergencyContactName || f['Emergency Contact'] || ''
      match.emergencyContactPhone = match.emergencyContactPhone || f['Emergency Phone'] || ''
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

// POST — Add a new sibling to the master roster
export async function POST(request: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()

  try {
    const data = await request.json()
    const { email, parentName, phone, studentName, studentAge, interests } = data
    if (!email || !studentName) {
      return NextResponse.json({ error: "Email and student name required" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await airtableGet(LEADS_TABLE, `LOWER({Email})=${airtableString(normalizedEmail)}`)
    const normalizedStudentName = String(studentName).trim().toLowerCase()

    // Family identity: only records whose stored Email equals this normalized
    // parent email (re-checked here, not just trusted from the filter).
    const sameFamily = existing.filter((r: any) =>
      text(r.fields?.["Email"]).toLowerCase() === normalizedEmail
    )
    // Student identity: same family AND same student name.
    const matches = sameFamily.filter((r: any) =>
      text(r.fields?.["Student Name"]).toLowerCase() === normalizedStudentName
    )

    if (matches.length > 1) {
      // Possible duplicates: identity is ambiguous, so update nothing.
      return NextResponse.json({
        success: false,
        needsReview: true,
        error: "More than one existing record matches this parent email and student name. Nothing was changed.",
        possibleMatches: matches.map((r: any) => r.id),
      }, { status: 409 })
    }

    // Email and Phone are the parent-portal login details: only admins may set them.
    const isAdmin = staff.role === "admin"

    if (matches.length === 1) {
      // Verified same family and student: fill empty fields only.
      // Never changes Student Name or Email; never replaces non-empty values.
      // Teachers cannot fill an empty Phone (a login detail).
      const existingStudent = matches[0]
      const candidates: Record<string, string> = {
        "Full Name": text(parentName),
        "Student Age": ageText(studentAge),
        "Interests": text(interests),
      }
      if (isAdmin) candidates["Phone"] = text(phone)
      const fields = fillEmptyOnly(existingStudent.fields || {}, candidates)
      if (Object.keys(fields).length > 0) {
        await airtablePatch(LEADS_TABLE, existingStudent.id, fields)
      }
      return NextResponse.json({
        success: true, newRecordId: existingStudent.id, existing: true,
        filledFields: Object.keys(fields),
      })
    }

    // A teacher may only add a sibling to a family that already exists, so a
    // teacher can never create a new parent login (email + phone).
    if (!isAdmin && sameFamily.length === 0) {
      return NextResponse.json(
        { error: "Only an admin can add a new family. Nothing was changed." },
        { status: 403 }
      )
    }

    // New sibling: one new Leads record, verified Leads fields only.
    const fields: Record<string, string> = {
      "Email": normalizedEmail,
      "Student Name": String(studentName).trim(),
      "Source": "family-portal-add-sibling",
      "Registration Form": "Partial",
      "Waiver Form": "Not Started",
    }
    // "Returning" only when at least one existing Leads record with this exact
    // normalized parent email confirms the family already exists. Otherwise
    // Status is left unset: the correct new-family value is not verified.
    if (sameFamily.length > 0) fields["Status"] = "Returning"
    const optional: Record<string, string> = {
      "Full Name": text(parentName) || text(sameFamily[0]?.fields?.["Full Name"]),
      // Teachers: the phone always comes from the existing family record.
      "Phone": (isAdmin ? text(phone) : "") || text(sameFamily[0]?.fields?.["Phone"]),
      "Student Age": ageText(studentAge),
      "Interests": text(interests),
    }
    for (const [field, value] of Object.entries(optional)) {
      if (value) fields[field] = value
    }
    const result = await airtableCreate(LEADS_TABLE, fields)
    return NextResponse.json({ success: true, newRecordId: result.records?.[0]?.id, existing: false })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
// PATCH — Update a student's info
export async function PATCH(request: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()

  try {
    // Malformed request data is a client error (400), never a 500.
    let data: Record<string, unknown>
    try {
      data = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { recordId, studentName, studentAge, interests, allergies, medicalConditions,
      emergencyContactName, emergencyContactPhone, parentName, phone, email: newEmail,
      clearFields } = data

    if (!recordId || typeof recordId !== 'string' || !/^rec[A-Za-z0-9]+$/.test(recordId)) {
      return NextResponse.json({ error: 'Record ID required' }, { status: 400 })
    }

    // Every editable value must be text, a number, or absent.
    const editable = [studentName, studentAge, interests, allergies, medicalConditions,
      emergencyContactName, emergencyContactPhone, parentName, phone, newEmail]
    const isPlain = (v: unknown) =>
      v === undefined || v === null || typeof v === 'string' || typeof v === 'number'
    if (!editable.every(isPlain)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (clearFields !== undefined &&
        (!Array.isArray(clearFields) || !clearFields.every((k) => typeof k === 'string'))) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // The master Leads table is the current source of truth. Historical
    // Summer records are read-only and are never written here.
    // Verified Leads field names only; blank values are skipped, so a blank
    // never replaces anything by itself.
    const leadsFields: Record<string, string> = {}
    const set = (field: string, value: unknown) => {
      const v = text(value)
      if (v) leadsFields[field] = v
    }
    set('Student Name', studentName)
    set('Student Age', ageText(studentAge))
    set('Interests', interests)
    set('Allergies', allergies)
    set('Medical Conditions', medicalConditions)
    set('Emergency Contact Name', emergencyContactName)
    set('Emergency Contact Phone', emergencyContactPhone)
    set('Full Name', parentName)

    // Email and Phone are the parent-portal login details; handled separately below.
    const requestedEmail = text(newEmail)
    const requestedPhone = text(phone)

    // Explicit clearing. The browser's clearFields list is only a request:
    // the server decides, using the record's current Airtable values.
    // Email, Phone, Student Name and Full Name are not listed and can never be cleared.
    const CLEARABLE: Record<string, string> = {
      studentAge: 'Student Age',
      interests: 'Interests',
      allergies: 'Allergies',
      medicalConditions: 'Medical Conditions',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
    }
    const requested = ((clearFields as string[] | undefined) ?? [])
      .filter((key) => Object.prototype.hasOwnProperty.call(CLEARABLE, key))
      .map((key) => CLEARABLE[key])
      .filter((field) => !(field in leadsFields)) // a submitted value wins

    const isAdmin = staff.role === 'admin'
    const needsCurrent = requested.length > 0 ||
      (!isAdmin && (requestedEmail !== '' || requestedPhone !== ''))

    let current: { id: string; fields: Record<string, unknown> } | null = null
    if (needsCurrent) {
      // Fetch this exact Leads record before any check that depends on it.
      current = await airtableGetRecord(LEADS_TABLE, recordId)
      if (!current) {
        // Current values cannot be verified: change nothing at all.
        return NextResponse.json(
          { error: 'Could not verify the current record. Nothing was changed.' },
          { status: 502 }
        )
      }
    }

    if (isAdmin) {
      if (requestedEmail) leadsFields['Email'] = requestedEmail
      if (requestedPhone) leadsFields['Phone'] = requestedPhone
    } else if (current) {
      // Teachers may resubmit the current Email/Phone unchanged (the edit form
      // always sends them), but any actual change is refused with 403 before
      // anything is written. Unchanged values are not rewritten.
      // Phone comparison: digits only. A North American number written with or
      // without the leading country code 1 (11 digits starting with 1) is the
      // same number; nothing else is stripped, so different numbers stay different.
      const digits = (v: unknown) => {
        const d = text(v).replace(/\D/g, '')
        return d.length === 11 && d.startsWith('1') ? d.slice(1) : d
      }
      const emailChanged = requestedEmail !== '' &&
        requestedEmail.toLowerCase() !== text(current.fields?.['Email']).toLowerCase()
      const phoneChanged = requestedPhone !== '' &&
        digits(requestedPhone) !== digits(current.fields?.['Phone'])
      if (emailChanged || phoneChanged) {
        return NextResponse.json(
          { error: 'Only an admin can change a parent email or phone. Nothing was changed.' },
          { status: 403 }
        )
      }
    }

    // Clear only fields that currently have a value in Airtable.
    const toClear: Record<string, null> = {}
    for (const field of requested) {
      if (current && text(current.fields?.[field])) toClear[field] = null
    }

    const update: Record<string, string | null> = { ...leadsFields, ...toClear }
    if (Object.keys(update).length > 0) {
      await airtablePatch(LEADS_TABLE, recordId, update)
    }

    return NextResponse.json({
      success: true,
      clearedFields: Object.keys(toClear),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// DELETE — Remove a duplicate record
export async function DELETE(request: NextRequest) {
  const staff = await getStaffSession()
  if (!staff) return staffUnauthorized()

  try {
    const data = await request.json()
    const { recordId } = data

    if (!recordId || typeof recordId !== 'string' || !/^rec[A-Za-z0-9]+$/.test(recordId)) {
      return NextResponse.json({ error: 'Record ID required' }, { status: 400 })
    }

    await airtableDelete(LEADS_TABLE, recordId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
