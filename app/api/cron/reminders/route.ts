import { NextRequest, NextResponse } from 'next/server'

/**
 * Daily reminder cron — runs on Vercel cron (no Viktor credits!)
 * Sends emails to parents whose registrations are missing important info:
 * - Waiver not signed
 * - No allergy info
 * - No emergency contact
 */

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'BASMA Academy <onboarding@resend.dev>'
const CRON_SECRET = process.env.CRON_SECRET || ''

async function fetchAllRecords(tableId: string) {
  const allRecords: { id: string; fields: Record<string, any>; createdTime: string }[] = []
  let offset: string | undefined

  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)

    const resp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?${params}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_PAT}` } }
    )

    if (!resp.ok) break
    const data = await resp.json()
    allRecords.push(...(data.records || []))
    offset = data.offset
  } while (offset)

  return allRecords
}

async function sendReminderEmail(parentEmail: string, parentName: string, studentName: string, missingItems: string[]) {
  if (!RESEND_API_KEY || !parentEmail) return false

  const missingList = missingItems.map(item => `<li style="margin: 4px 0; color: #92400e;">${item}</li>`).join('')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="color: #ffd700; margin: 0; font-size: 22px;">📋 Registration Reminder</h2>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #333; margin: 0 0 12px;">
          Hi ${parentName || 'there'}! 👋
        </p>
        <p style="font-size: 15px; color: #333; margin: 0 0 16px;">
          We're so excited to have <strong>${studentName}</strong> at BASMA Music Academy! We noticed a few items still need to be completed:
        </p>
        <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold; color: #92400e;">Missing Information:</p>
          <ul style="margin: 0; padding-left: 20px;">${missingList}</ul>
        </div>
        <p style="font-size: 14px; color: #333; margin: 16px 0;">
          This information helps us keep ${studentName} safe and provide the best experience. Please complete registration at your earliest convenience:
        </p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="https://basmaworld.com/enroll" 
             style="display: inline-block; background: linear-gradient(135deg, #c9a84c, #e4cc7a); color: #1a1a2e; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
            Complete Registration →
          </a>
        </p>
        <p style="font-size: 14px; color: #666; margin: 16px 0 0;">
          Thank you! 🎵<br>
          — Miss Basma & the BASMA Team
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Become A Singer Music Academy · 6787 W Tropicana Ave Suite 260, Las Vegas<br>
          <a href="https://basmaworld.com" style="color: #6b21a8;">basmaworld.com</a> · (702) 788-7369
        </p>
      </div>
    </div>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: parentEmail,
        subject: `📋 ${studentName} — please complete your BASMA registration`,
        html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch from both tables
    const [leadRecords, summerRecords] = await Promise.all([
      fetchAllRecords(LEADS_TABLE),
      fetchAllRecords(SUMMER_TABLE),
    ])

    // Index summer records by student name + parent email for cross-reference
    const summerByKey: Record<string, Record<string, any>> = {}
    for (const r of summerRecords) {
      const key = `${(r.fields['Student Name'] || '').toLowerCase().trim()}|${(r.fields['Parent Email'] || '').toLowerCase().trim()}`
      summerByKey[key] = r.fields
    }

    let emailsSent = 0
    let studentsChecked = 0
    const errors: string[] = []

    // Check each lead record for incomplete data
    // Group by email to avoid sending multiple emails per family
    const familyReminders: Record<string, { parentName: string; students: { name: string; missing: string[] }[] }> = {}

    for (const record of leadRecords) {
      const f = record.fields
      const email = (f['Email'] || '').trim().toLowerCase()
      const parentName = f['Full Name'] || ''
      const studentName = f['Student Name'] || ''
      if (!email || !studentName) continue

      studentsChecked++

      // Cross-reference with summer table
      const summerKey = `${studentName.toLowerCase().trim()}|${email}`
      const summerData = summerByKey[summerKey]

      const missingItems: string[] = []

      // Check waiver
      const waiverStatus = (f['Waiver Form'] || '').toLowerCase()
      const liabilityAgreed = summerData?.['Liability Agreed']
      if (waiverStatus !== 'complete' && liabilityAgreed !== 'Yes') {
        missingItems.push('Liability waiver — please sign the waiver on our registration form')
      }

      // Check allergies
      const allergies = summerData?.['Allergies'] || ''
      if (!allergies || allergies === '') {
        missingItems.push('Allergy information — we need this for snack time safety')
      }

      // Check emergency contact
      const emergencyName = summerData?.['Emergency Contact Name'] || ''
      const emergencyPhone = summerData?.['Emergency Contact Phone'] || ''
      if (!emergencyName || !emergencyPhone) {
        missingItems.push('Emergency contact name and phone number')
      }

      // Check registration status
      const status = (f['Status'] || '').toLowerCase()
      const regForm = (f['Registration Form'] || '').toLowerCase()
      if (status === 'incomplete' || regForm === 'partial' || regForm === 'not started') {
        missingItems.push('Complete your registration form')
      }

      if (missingItems.length > 0) {
        if (!familyReminders[email]) {
          familyReminders[email] = { parentName, students: [] }
        }
        familyReminders[email].students.push({ name: studentName, missing: missingItems })
      }
    }

    // Send one email per family
    for (const [email, { parentName, students }] of Object.entries(familyReminders)) {
      // Combine all missing items for all children
      const allMissing = students.flatMap(s =>
        s.missing.map(m => `${s.name}: ${m}`)
      )

      const sent = await sendReminderEmail(email, parentName, students.map(s => s.name).join(' & '), allMissing)
      if (sent) emailsSent++
      else errors.push(`Failed: ${email.slice(0, 5)}***`)

      // Rate limit: 2 emails per second to avoid Resend limits
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      studentsChecked,
      familiesNeedingReminders: Object.keys(familyReminders).length,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Cron reminder error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
