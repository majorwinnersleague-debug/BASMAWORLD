import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
// Write to the BASMA Marketing Leads table — same table the parent portal reads from
const TABLE_ID = 'tbl1diIEhM9MtKViE'

async function airtableRequest(method: string, body?: Record<string, unknown>, recordId?: string) {
  const url = recordId
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_ID}/${recordId}`
    : `https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_ID}`

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
    const { name, phone, email, source, status, interests, experienceLevel, referralSource, studentName, studentAge } = data

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

    const result = await airtableRequest('POST', {
      records: [{ fields }],
    })

    const recordId = result?.records?.[0]?.id || null
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

    await airtableRequest('PATCH', {
      records: [{ id: recordId, fields }],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 })
  }
}
