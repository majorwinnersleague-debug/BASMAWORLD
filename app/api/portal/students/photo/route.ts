import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

/**
 * Upload student photo from parent portal.
 * Accepts base64 image data, stores as Airtable attachment via URL.
 * Since Airtable attachments need a public URL, we use a data URI workaround:
 * store the base64 in a text field for now.
 */
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { recordId, photoBase64 } = await req.json()

    if (!recordId || !photoBase64) {
      return NextResponse.json({ error: 'recordId and photoBase64 required' }, { status: 400 })
    }

    // Validate base64 size (max 500KB)
    if (photoBase64.length > 700000) {
      return NextResponse.json({ error: 'Photo too large. Please use a smaller image.' }, { status: 400 })
    }

    // Verify this record belongs to the logged-in parent
    const verifyUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}/${recordId}`
    const verifyRes = await fetch(verifyUrl, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    })
    if (!verifyRes.ok) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    const record = await verifyRes.json()
    const recordEmail = (record.fields?.['Email'] || '').toLowerCase().trim()
    if (recordEmail !== user.email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Store photo in Leads table "Student Photo" field
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{ id: recordId, fields: { 'Student Photo': photoBase64 } }],
      }),
    })

    // Also update Summer table if possible
    const studentName = record.fields?.['Student Name'] || ''
    if (studentName) {
      const formula = encodeURIComponent(
        `AND(LOWER({Parent Email}) = '${user.email.toLowerCase().trim()}', LOWER({Student Name}) = '${studentName.toLowerCase().trim()}')`
      )
      const summerUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?filterByFormula=${formula}&maxRecords=1`
      const summerRes = await fetch(summerUrl, {
        headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
      })
      const summerData = await summerRes.json()
      const summerRecord = summerData.records?.[0]

      if (summerRecord) {
        await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [{ id: summerRecord.id, fields: { 'Student Photo': photoBase64 } }],
          }),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
