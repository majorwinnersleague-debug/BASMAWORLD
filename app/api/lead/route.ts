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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      name, phone, email, source, status, interests, experienceLevel,
      referralSource, studentName, studentAge, discoveryWeek, timeSlot,
      // New fields for enriched registration
      preferredDay, preferredTime, allergies, medicalConditions,
      emergencyContactName, emergencyContactPhone, liabilityAgreed,
      photoConsent
    } = data

    // Map to BASMA Marketing Leads field names
    const fields: Record<string, string> = {}
    if (name) fields['Full Name'] = name
    if (phone) fields['Phone'] = phone
    if (email) fields['Email'] = email
    if (source) fields['Source'] = source
    fields['Status'] = status || 'Incomplete'
    if (interests) fields['Interests'] = interests
    if (experienceLevel) fields['Experience Level'] = experienceLevel
    if (referralSource) fields['Referral Source'] = referralSource
    if (studentName) fields['Student Name'] = studentName
    if (studentAge) fields['Student Age'] = String(studentAge)
    if (discoveryWeek) fields['Discovery Week'] = discoveryWeek
    if (timeSlot) fields['Time Slot'] = timeSlot
    // Set waiver status based on liability agreement
    if (liabilityAgreed) {
      fields['Waiver Form'] = 'Complete'
      fields['Registration Form'] = 'Complete'
    }

    const result = await airtableRequest(TABLE_ID, 'POST', {
      records: [{ fields }],
    })

    const recordId = result?.records?.[0]?.id || null

    // Also write to Summer 2026 Registrations (full student data)
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
      summerFields['Registration Date'] = new Date().toISOString().split('T')[0]

      // Include scheduling info
      if (preferredDay) summerFields['Notes'] = `Preferred day: ${preferredDay}, Time: ${preferredTime || 'TBD'}`
      if (timeSlot && timeSlot !== 'By Appointment') summerFields['Notes'] = `Time Slot: ${timeSlot}`

      await airtableRequest(SUMMER_TABLE_ID, 'POST', {
        records: [{ fields: summerFields }],
      })
    } catch (summerErr) {
      // Don't fail if Summer table write fails
      console.error('Summer 2026 Registration write error:', summerErr)
    }

    // Send email notification to owner via formsubmit
    try {
      await fetch('https://formsubmit.co/ajax/becomeasingermusicacademy@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `🎵 New BASMA Registration: ${name || 'Unknown'}`,
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
        }),
      })
    } catch (emailErr) {
      // Don't fail the request if notification fails
      console.error('Email notification error:', emailErr)
    }

    return NextResponse.json({ success: true, recordId })
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

    // Map to BASMA Marketing Leads field names
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
