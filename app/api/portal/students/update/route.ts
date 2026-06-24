import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'

/**
 * Update student info from parent portal.
 * Only allows updating safe fields (allergies, emergency contact, waiver, etc.)
 * Verifies the record belongs to the logged-in parent.
 */
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { recordId, allergies, medicalConditions, emergencyContactName, emergencyContactPhone, liabilityAgreed } = await req.json()

    if (!recordId) {
      return NextResponse.json({ error: 'recordId required' }, { status: 400 })
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

    // Update Leads table — only allowed fields
    const leadFields: Record<string, string> = {}
    if (liabilityAgreed !== undefined) {
      leadFields['Waiver Form'] = liabilityAgreed ? 'Complete' : 'Not Started'
      leadFields['Registration Form'] = 'Complete'
    }

    if (Object.keys(leadFields).length > 0) {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{ id: recordId, fields: leadFields }],
        }),
      })
    }

    // Update Summer table — find matching student
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
        const summerFields: Record<string, string> = {}
        if (allergies !== undefined) summerFields['Allergies'] = allergies || 'None'
        if (medicalConditions !== undefined) summerFields['Medical Conditions'] = medicalConditions || 'None'
        if (emergencyContactName !== undefined) summerFields['Emergency Contact Name'] = emergencyContactName
        if (emergencyContactPhone !== undefined) summerFields['Emergency Contact Phone'] = emergencyContactPhone
        if (liabilityAgreed !== undefined) summerFields['Liability Agreed'] = liabilityAgreed ? 'Yes' : 'No'

        if (Object.keys(summerFields).length > 0) {
          await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${AIRTABLE_PAT}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              records: [{ id: summerRecord.id, fields: summerFields }],
            }),
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
