import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LESSON_TABLE = 'Private Lesson Requests' // Will auto-create or use existing
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''

/**
 * POST: Parent requests a free 20-min private lesson.
 * Creates an Airtable record and emails Sarah for approval.
 * 
 * PATCH: Sarah approves/denies from teacher portal or Airtable.
 * Sends confirmation or denial email to parent automatically.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { parentName, email, phone, studentName, studentAge, instrument, preferredDay, preferredTime, notes } = body

    if (!parentName || !email || !phone || !studentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Airtable
    let recordId = ''
    if (AIRTABLE_PAT) {
      try {
        const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(LESSON_TABLE)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [{
              fields: {
                'Parent Name': parentName,
                'Email': email,
                'Phone': phone,
                'Student Name': studentName,
                'Student Age': studentAge || '',
                'Instrument': instrument || 'Any',
                'Preferred Day': preferredDay || '',
                'Preferred Time': preferredTime || '',
                'Notes': notes || '',
                'Status': 'Pending Approval',
                'Request Date': new Date().toISOString().split('T')[0],
              },
            }],
          }),
        })
        const data = await res.json()
        recordId = data.records?.[0]?.id || ''
      } catch (err) {
        console.error('Airtable create error:', err)
      }
    }

    // Email Sarah about the request
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BASMA Academy <onboarding@resend.dev>',
            to: 'becomeasingermusicacademy@gmail.com',
            subject: `🎵 New Private Lesson Request — ${studentName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h2 style="color: #ffd700; margin: 0;">🎵 Private Lesson Request</h2>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <p><strong>Parent:</strong> ${parentName}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Student:</strong> ${studentName} (age ${studentAge || 'N/A'})</p>
                  <p><strong>Instrument:</strong> ${instrument || 'Any'}</p>
                  <p><strong>Preferred:</strong> ${preferredDay || 'Flexible'} at ${preferredTime || 'Flexible'}</p>
                  ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                  <hr style="margin: 20px 0;">
                  <p style="font-size: 14px; color: #666;">
                    To approve: Update the record in Airtable to "Approved" with a confirmed time.
                    A confirmation email will be sent automatically.
                  </p>
                  <p style="text-align: center; margin-top: 16px;">
                    <a href="https://basmaworld.com/teacher" style="background: #6b21a8; color: #fff; padding: 10px 24px; border-radius: 20px; text-decoration: none; font-weight: bold;">Open Teacher Portal</a>
                  </p>
                </div>
              </div>
            `,
          }),
        })
      } catch (emailErr) {
        console.error('Email notification error:', emailErr)
      }
    }

    // Also send via FormSubmit as backup
    try {
      await fetch('https://formsubmit.co/ajax/becomeasingermusicacademy@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `🎵 Private Lesson Request: ${studentName}`,
          'Parent': parentName,
          'Phone': phone,
          'Email': email,
          'Student': `${studentName} (age ${studentAge || 'N/A'})`,
          'Instrument': instrument || 'Any',
          'Preferred Day': preferredDay || 'Flexible',
          'Preferred Time': preferredTime || 'Flexible',
          'Notes': notes || '',
        }),
      })
    } catch { /* backup notification */ }

    return NextResponse.json({ success: true, recordId })
  } catch (err) {
    console.error('Private lesson request error:', err)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}

/**
 * PATCH: Approve or deny a private lesson request.
 * Sends confirmation email to parent with approved time.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { recordId, status, confirmedDay, confirmedTime, denialReason } = body

    if (!recordId || !status) {
      return NextResponse.json({ error: 'recordId and status required' }, { status: 400 })
    }

    // Get the record from Airtable to find parent email
    let parentEmail = ''
    let parentName = ''
    let studentName = ''
    let instrument = ''

    if (AIRTABLE_PAT) {
      const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(LESSON_TABLE)}/${recordId}`, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_PAT}` },
      })
      const data = await res.json()
      parentEmail = data.fields?.['Email'] || ''
      parentName = data.fields?.['Parent Name'] || ''
      studentName = data.fields?.['Student Name'] || ''
      instrument = data.fields?.['Instrument'] || ''

      // Update status
      const updateFields: Record<string, string> = { 'Status': status }
      if (confirmedDay) updateFields['Confirmed Day'] = confirmedDay
      if (confirmedTime) updateFields['Confirmed Time'] = confirmedTime
      if (denialReason) updateFields['Notes'] = `Denial: ${denialReason}`

      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(LESSON_TABLE)}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ id: recordId, fields: updateFields }] }),
      })
    }

    // Send confirmation/denial email
    if (RESEND_API_KEY && parentEmail) {
      if (status === 'Approved' && confirmedDay && confirmedTime) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BASMA Academy <onboarding@resend.dev>',
            to: parentEmail,
            subject: `✅ Private Lesson Confirmed — ${confirmedDay} at ${confirmedTime}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h2 style="color: #fff; margin: 0;">✅ Lesson Confirmed!</h2>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <p>Hi ${parentName},</p>
                  <p>Your free 20-minute private lesson has been confirmed!</p>
                  <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #bbf7d0;">
                    <p style="margin: 0;"><strong>Student:</strong> ${studentName}</p>
                    <p style="margin: 4px 0 0;"><strong>Instrument:</strong> ${instrument}</p>
                    <p style="margin: 4px 0 0;"><strong>Day:</strong> ${confirmedDay}</p>
                    <p style="margin: 4px 0 0;"><strong>Time:</strong> ${confirmedTime}</p>
                    <p style="margin: 4px 0 0;"><strong>Duration:</strong> 20 minutes</p>
                  </div>
                  <p><strong>📍 Location:</strong> 6787 W Tropicana Ave Suite 260, Las Vegas, NV 89103</p>
                  <p><strong>📞 Questions?</strong> Call (702) 788-7369</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                    BASMA — Become A Singer Music Academy · <a href="https://basmaworld.com">basmaworld.com</a>
                  </p>
                </div>
              </div>
            `,
          }),
        })
      } else if (status === 'Denied') {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BASMA Academy <onboarding@resend.dev>',
            to: parentEmail,
            subject: 'BASMA Private Lesson — Schedule Update',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
                  <p>Hi ${parentName},</p>
                  <p>Unfortunately, we weren't able to accommodate the requested time for ${studentName}'s private lesson.</p>
                  ${denialReason ? `<p><strong>Reason:</strong> ${denialReason}</p>` : ''}
                  <p>Please call us at <strong>(702) 788-7369</strong> to find another time that works!</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                    BASMA — Become A Singer Music Academy · <a href="https://basmaworld.com">basmaworld.com</a>
                  </p>
                </div>
              </div>
            `,
          }),
        })
      }
    }

    return NextResponse.json({ success: true, status })
  } catch (err) {
    console.error('Private lesson update error:', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
