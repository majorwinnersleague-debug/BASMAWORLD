import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
// Write to the BASMA Marketing Leads table — same table the parent portal reads from
const TABLE_ID = 'tbl1diIEhM9MtKViE'
// Also write to Summer 2026 Registrations for full student data
const SUMMER_TABLE_ID = 'tblfOnRDkfgZoCF9X'

async function airtableRequest(tableId: string, method: string, body?: Record<string, unknown>, recordId?: string) {
  const url = recordId
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}/${recordId}`
    : `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}`

  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  return res.json()
}

// ── Find existing record by email (and optionally student name) ──
async function findExistingRecord(
  tableId: string,
  email: string,
  studentName?: string
): Promise<{ id: string; fields: Record<string, string> } | null> {
  if (!email) return null

  // Search by email first
  const formula = `{Email} = '${email.replace(/'/g, "\\'")}'`
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=100`

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  const records = data.records || []

  if (records.length === 0) return null

  // If we have a student name, find the matching student record
  if (studentName) {
    const match = records.find(
      (r: { fields: Record<string, string> }) =>
        (r.fields['Student Name'] || '').toLowerCase().trim() === studentName.toLowerCase().trim()
    )
    if (match) return match
    // Different student name = different child → create a NEW record
    return null
  }

  // No student name provided — return first record with this email
  return records[0]
}

async function findExistingSummerRecord(
  email: string,
  studentName?: string
): Promise<{ id: string; fields: Record<string, string> } | null> {
  if (!email) return null

  const formula = `{Parent Email} = '${email.replace(/'/g, "\\'")}'`
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE_ID}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=100`

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  const records = data.records || []

  if (records.length === 0) return null

  if (studentName) {
    const match = records.find(
      (r: { fields: Record<string, string> }) =>
        (r.fields['Student Name'] || '').toLowerCase().trim() === studentName.toLowerCase().trim()
    )
    if (match) return match
    // Different student name = different child → create a NEW record
    return null
  }

  return records[0]
}

// ── Merge fields: only overwrite empty/missing fields ──
function mergeFields(
  existing: Record<string, string>,
  incoming: Record<string, string>
): Record<string, string> {
  const merged: Record<string, string> = {}
  for (const [key, value] of Object.entries(incoming)) {
    if (!value) continue // skip empty incoming values
    const existingVal = existing[key]
    // Only update if existing value is empty/missing or incoming has more info
    if (!existingVal || existingVal.trim() === '' || existingVal === 'Incomplete') {
      merged[key] = value
    }
  }
  return merged
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      name, phone, email, source, status, interests, experienceLevel,
      referralSource, studentName, studentAge, discoveryWeek, timeSlot,
      preferredDay, preferredTime, allergies, medicalConditions,
      emergencyContactName, emergencyContactPhone, liabilityAgreed,
      photoConsent
    } = data

    // ── Build Marketing Leads fields ──
    const incomingFields: Record<string, string> = {}
    if (name) incomingFields['Full Name'] = name
    if (phone) incomingFields['Phone'] = phone
    if (email) incomingFields['Email'] = email
    if (source) incomingFields['Source'] = source
    incomingFields['Status'] = status || 'Incomplete'
    if (interests) incomingFields['Interests'] = interests
    if (experienceLevel) incomingFields['Experience Level'] = experienceLevel
    if (referralSource) incomingFields['Referral Source'] = referralSource
    if (studentName) incomingFields['Student Name'] = studentName
    if (studentAge) incomingFields['Student Age'] = String(studentAge)
    if (discoveryWeek) incomingFields['Discovery Week'] = discoveryWeek
    if (timeSlot) incomingFields['Time Slot'] = timeSlot
    if (allergies) incomingFields['Allergies'] = allergies
    if (medicalConditions) incomingFields['Medical Conditions'] = medicalConditions
    if (emergencyContactName) incomingFields['Emergency Contact Name'] = emergencyContactName
    if (emergencyContactPhone) incomingFields['Emergency Contact Phone'] = emergencyContactPhone
    if (interests) incomingFields['Enrolled Class'] = interests
    if (liabilityAgreed) {
      incomingFields['Liability Agreed'] = 'Yes'
      incomingFields['Waiver Form'] = 'Complete'
      incomingFields['Registration Form'] = 'Complete'
    }

    // ── UPSERT: Check for existing record ──
    let recordId: string | null = null
    const existingLead = await findExistingRecord(TABLE_ID, email, studentName)

    if (existingLead) {
      // Update existing record — merge only new/missing fields
      const fieldsToUpdate = mergeFields(existingLead.fields, incomingFields)
      // Always update status if incoming is more complete
      if (status && status !== 'Incomplete') {
        fieldsToUpdate['Status'] = status
      }

      if (Object.keys(fieldsToUpdate).length > 0) {
        await airtableRequest(TABLE_ID, 'PATCH', {
          records: [{ id: existingLead.id, fields: fieldsToUpdate }],
        })
      }
      recordId = existingLead.id
    } else {
      // Create new record
      const result = await airtableRequest(TABLE_ID, 'POST', {
        records: [{ fields: incomingFields }],
      })
      recordId = result?.records?.[0]?.id || null
    }

    // ── UPSERT: Summer 2026 Registrations ──
    try {
      const summerFields: Record<string, string> = {}
      if (studentName) summerFields['Student Name'] = studentName
      if (name) summerFields['Parent Name'] = name
      if (email) summerFields['Parent Email'] = email
      if (phone) summerFields['Parent Phone'] = phone
      if (studentAge) summerFields['Age'] = String(studentAge)
      if (interests) summerFields['Class'] = interests
      if (allergies !== undefined) summerFields['Allergies'] = allergies || 'None'
      if (medicalConditions !== undefined) summerFields['Medical Conditions'] = medicalConditions || 'None'
      if (emergencyContactName) summerFields['Emergency Contact Name'] = emergencyContactName
      if (emergencyContactPhone) summerFields['Emergency Contact Phone'] = emergencyContactPhone
      if (liabilityAgreed) summerFields['Liability Agreed'] = 'Yes'
      if (photoConsent !== undefined) summerFields['Photo Consent'] = photoConsent ? 'Yes' : 'No'
      summerFields['Payment Status'] = 'Unpaid'

      if (preferredDay) summerFields['Notes'] = `Preferred day: ${preferredDay}, Time: ${preferredTime || 'TBD'}`
      if (timeSlot && timeSlot !== 'By Appointment') summerFields['Notes'] = `Time Slot: ${timeSlot}`

      const existingSummer = await findExistingSummerRecord(email, studentName)

      if (existingSummer) {
        // Update existing — only fill in missing fields
        const fieldsToUpdate = mergeFields(existingSummer.fields, summerFields)
        if (Object.keys(fieldsToUpdate).length > 0) {
          await airtableRequest(SUMMER_TABLE_ID, 'PATCH', {
            records: [{ id: existingSummer.id, fields: fieldsToUpdate }],
          })
        }
      } else {
        // Create new summer registration
        summerFields['Registration Date'] = new Date().toISOString().split('T')[0]
        await airtableRequest(SUMMER_TABLE_ID, 'POST', {
          records: [{ fields: summerFields }],
        })
      }
    } catch (summerErr) {
      console.error('Summer 2026 Registration write error:', summerErr)
    }

    // ── Email notification ──
    try {
      const actionType = existingLead ? 'Updated' : 'New'
      await fetch('https://formsubmit.co/ajax/becomeasingermusicacademy@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `🎵 ${actionType} BASMA Registration: ${name || 'Unknown'}`,
          'Parent Name': name || '',
          Phone: phone || '',
          Email: email || '',
          'Student Name': studentName || '',
          'Student Age': studentAge || '',
          'Discovery Week': discoveryWeek || '',
          'Time Slot': timeSlot || '',
          'Preferred Day': preferredDay || '',
          'Preferred Time': preferredTime || '',
          Interests: interests || '',
          Experience: experienceLevel || '',
          'How Heard': referralSource || '',
          Source: source || 'website-form',
          'Waiver': liabilityAgreed ? 'Signed ✓' : 'Not signed',
          'Allergies': allergies || 'Not specified',
          'Action': actionType,
        }),
      })
    } catch (emailErr) {
      console.error('Email notification error:', emailErr)
    }

    return NextResponse.json({
      success: true,
      recordId,
      action: existingLead ? 'updated' : 'created',
    })
  } catch (error) {
    console.error('Lead POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create lead' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { recordId, ...rest } = data

    if (!recordId) {
      return NextResponse.json({ success: false, error: 'recordId required' }, { status: 400 })
    }

    const fields: Record<string, string> = {}
    if (rest.name) fields['Full Name'] = rest.name
    if (rest.phone) fields['Phone'] = rest.phone
    if (rest.email) fields['Email'] = rest.email
    if (rest.interests) fields['Interests'] = rest.interests
    if (rest.experienceLevel) fields['Experience Level'] = rest.experienceLevel
    if (rest.referralSource) fields['Referral Source'] = rest.referralSource
    if (rest.status) fields['Status'] = rest.status
    if (rest.message) fields['Message'] = rest.message
    if (rest.studentName) fields['Student Name'] = rest.studentName
    if (rest.studentAge) fields['Student Age'] = String(rest.studentAge)

    await airtableRequest(TABLE_ID, 'PATCH', {
      records: [{ id: recordId, fields }],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 })
  }
}

// ── GET: Lookup registration by email ──
// Used by enrollment page to show what's already complete
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    const studentName = url.searchParams.get('student')

    if (!email) {
      return NextResponse.json({ success: false, error: 'email required' }, { status: 400 })
    }

    // Look up in both tables
    const [lead, summer] = await Promise.all([
      findExistingRecord(TABLE_ID, email, studentName || undefined),
      findExistingSummerRecord(email, studentName || undefined),
    ])

    return NextResponse.json({
      success: true,
      lead: lead ? { id: lead.id, ...lead.fields } : null,
      registration: summer ? { id: summer.id, ...summer.fields } : null,
    })
  } catch (error) {
    console.error('Lead GET error:', error)
    return NextResponse.json({ success: false, error: 'Lookup failed' }, { status: 500 })
  }
}
