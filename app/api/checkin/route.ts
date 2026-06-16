import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const CHECKIN_TABLE = process.env.CHECKIN_TABLE_ID || '' // Will be set after table creation
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'BASMA Academy <onboarding@resend.dev>'

const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || '1515'

async function patchAirtable(tableId: string, recordId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })
  return res.json()
}

async function createAirtableRecord(tableId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }] }),
  })
  return res.json()
}

async function deleteAirtableRecord(tableId: string, recordId: string) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}/${recordId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  return res.json()
}

async function findCheckInRecord(studentName: string, date: string) {
  if (!CHECKIN_TABLE) return null
  const formula = `AND({Student Name}="${studentName}",{Check-In Date}="${date}")`
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: '1' })
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${CHECKIN_TABLE}?${params}`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  return data.records?.[0] || null
}

async function getRecord(tableId: string, recordId: string) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}/${recordId}`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  return res.json()
}

async function findSummerRecord(studentName: string, parentEmail: string) {
  const formula = parentEmail
    ? `OR({Student Name}="${studentName}",{Parent Email}="${parentEmail}")`
    : `{Student Name}="${studentName}"`
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: '5' })
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?${params}`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  return data.records?.[0] || null
}

async function sendCheckInEmail(parentEmail: string, parentName: string, studentName: string, isIncomplete: boolean) {
  if (!RESEND_API_KEY || !parentEmail) return

  const now = new Date()
  const timeStr = now.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const incompleteSection = isIncomplete ? `
    <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 15px; color: #92400e; font-weight: bold;">
        ⚠️ Registration Incomplete
      </p>
      <p style="margin: 8px 0 0; font-size: 14px; color: #92400e;">
        It looks like ${studentName}'s registration isn't fully complete yet. Please finish registration so we have all the important information (allergies, emergency contacts, etc).
      </p>
      <p style="margin: 12px 0 0;">
        <a href="https://basmaworld.com/enroll"
           style="display: inline-block; background: #f59e0b; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
          Complete Registration →
        </a>
      </p>
    </div>
  ` : ''

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="color: #ffd700; margin: 0; font-size: 22px;">✅ Check-In Confirmed!</h2>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #333; margin: 0 0 12px;">
          Hi ${parentName || 'there'}! 👋
        </p>
        <p style="font-size: 15px; color: #333; margin: 0 0 16px;">
          <strong>${studentName}</strong> has been checked in at BASMA Music Academy.
        </p>
        <div style="background: #f0fdf4; padding: 14px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; font-size: 14px; color: #166534;">
            <strong>✅ Checked in at:</strong> ${timeStr} (Pacific)
          </p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #166534;">
            <strong>📍 Location:</strong> 6787 W Tropicana Ave Suite 260, Las Vegas
          </p>
        </div>
        ${incompleteSection}
        <p style="font-size: 14px; color: #666; margin: 16px 0 0;">
          Thank you for choosing BASMA! 🎵
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Become A Singer Music Academy · <a href="https://basmaworld.com" style="color: #6b21a8;">basmaworld.com</a>
        </p>
      </div>
    </div>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: parentEmail,
        subject: `✅ ${studentName} is checked in at BASMA!${isIncomplete ? ' — Please complete registration' : ''}`,
        html,
      }),
    })
  } catch (err) {
    console.error('Check-in email error:', err)
  }
}

// ═══ CHECK IN ═══
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      recordId, teacherCode, studentName, parentEmail, parentName,
      parentPhone, isIncomplete, studentAge, allergies, medicalConditions,
      emergencyContactName, emergencyContactPhone, hasWaiver, interests
    } = data

    if (teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!recordId) {
      return NextResponse.json({ success: false, error: 'recordId required' }, { status: 400 })
    }

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })
    const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', timeStyle: 'short' })
    const isoDate = now.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }) // YYYY-MM-DD
    const checkInNote = `Checked in: ${dateStr} ${timeStr}`

    // 1. Update the Marketing Leads record
    try {
      const current = await getRecord(LEADS_TABLE, recordId)
      const existingNotes = current?.fields?.['Notes'] || ''
      const updatedNotes = existingNotes ? `${existingNotes}\n${checkInNote}` : checkInNote
      await patchAirtable(LEADS_TABLE, recordId, { 'Notes': updatedNotes })
    } catch (err) {
      console.error('Marketing Leads check-in update error:', err)
    }

    // 2. Update Summer 2026 Registrations if matching
    try {
      const summerRec = await findSummerRecord(studentName || '', parentEmail || '')
      if (summerRec) {
        const existingNotes = summerRec.fields?.['Notes'] || ''
        const updatedNotes = existingNotes ? `${existingNotes}\n${checkInNote}` : checkInNote
        await patchAirtable(SUMMER_TABLE, summerRec.id, { 'Notes': updatedNotes })
      }
    } catch (err) {
      console.error('Summer table check-in update error:', err)
    }

    // 3. Create record in Check-In Log table
    if (CHECKIN_TABLE) {
      try {
        await createAirtableRecord(CHECKIN_TABLE, {
          'Student Name': studentName || '',
          'Parent Name': parentName || '',
          'Parent Email': parentEmail || '',
          'Parent Phone': parentPhone || '',
          'Check-In Date': isoDate,
          'Check-In Time': timeStr,
          'Class': interests || '',
          'Age': studentAge || '',
          'Allergies': allergies || '',
          'Medical Conditions': medicalConditions || '',
          'Emergency Contact': emergencyContactName || '',
          'Emergency Phone': emergencyContactPhone || '',
          'Registration Complete': isIncomplete === false,
          'Waiver Signed': hasWaiver === true,
        })
      } catch (err) {
        console.error('Check-In Log create error:', err)
      }
    }

    // 4. Send check-in confirmation email
    await sendCheckInEmail(
      parentEmail || '',
      parentName || '',
      studentName || 'Your child',
      isIncomplete === true
    )

    return NextResponse.json({
      success: true,
      checkedInAt: `${dateStr} ${timeStr}`,
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json({ success: false, error: 'Check-in failed' }, { status: 500 })
  }
}

// ═══ UNCHECK (DELETE) ═══
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()
    const { teacherCode, studentName, recordId } = data

    if (teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const isoDate = now.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })

    // Remove from Check-In Log if table exists
    if (CHECKIN_TABLE) {
      try {
        const checkInRec = await findCheckInRecord(studentName || '', isoDate)
        if (checkInRec) {
          await deleteAirtableRecord(CHECKIN_TABLE, checkInRec.id)
        }
      } catch (err) {
        console.error('Check-In Log delete error:', err)
      }
    }

    // Update notes in Marketing Leads to reflect unchecking
    if (recordId) {
      try {
        const current = await getRecord(LEADS_TABLE, recordId)
        const existingNotes = current?.fields?.['Notes'] || ''
        const dateStr = now.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' })
        const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', timeStyle: 'short' })
        const updatedNotes = existingNotes
          ? `${existingNotes}\nUnchecked: ${dateStr} ${timeStr}`
          : `Unchecked: ${dateStr} ${timeStr}`
        await patchAirtable(LEADS_TABLE, recordId, { 'Notes': updatedNotes })
      } catch (err) {
        console.error('Marketing Leads uncheck update error:', err)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Uncheck error:', error)
    return NextResponse.json({ success: false, error: 'Uncheck failed' }, { status: 500 })
  }
}
