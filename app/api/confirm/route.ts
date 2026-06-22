import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
// Will be set once the table is created — for now use a fallback
const CONFIRM_TABLE = process.env.AIRTABLE_CONFIRM_TABLE || ''

async function airtableFetch(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}

// GET: Look up a family's registered students by email
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')?.trim().toLowerCase()
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })
    }

    // Search both tables for students under this email
    const students: Array<{
      name: string
      age: string
      class: string
      source: string
    }> = []
    const seen = new Set<string>()

    // 1. Marketing Leads table
    const leadsFormula = `{Email} = '${email.replace(/'/g, "\\'")}'`
    const leadsUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${encodeURIComponent(leadsFormula)}&maxRecords=50`
    const leadsRes = await airtableFetch(leadsUrl)
    const leadsData = await leadsRes.json()
    
    for (const r of (leadsData.records || [])) {
      const f = r.fields || {}
      const studentName = (f['Student Name'] || '').trim()
      if (studentName && !seen.has(studentName.toLowerCase())) {
        seen.add(studentName.toLowerCase())
        students.push({
          name: studentName,
          age: f['Student Age'] || '',
          class: f['Interests'] || f['Time Slot'] || '',
          source: 'leads'
        })
      }
    }

    // 2. Summer 2026 Registrations table
    const summerFormula = `{Parent Email} = '${email.replace(/'/g, "\\'")}'`
    const summerUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?filterByFormula=${encodeURIComponent(summerFormula)}&maxRecords=50`
    const summerRes = await airtableFetch(summerUrl)
    const summerData = await summerRes.json()
    
    for (const r of (summerData.records || [])) {
      const f = r.fields || {}
      const studentName = (f['Student Name'] || '').trim()
      if (studentName && !seen.has(studentName.toLowerCase())) {
        seen.add(studentName.toLowerCase())
        students.push({
          name: studentName,
          age: f['Age'] || '',
          class: f['Class'] || '',
          source: 'summer'
        })
      }
    }

    // Get parent name from either table
    const parentName = leadsData.records?.[0]?.fields?.['Full Name'] 
      || summerData.records?.[0]?.fields?.['Parent Name'] 
      || ''

    const parentPhone = leadsData.records?.[0]?.fields?.['Phone']
      || summerData.records?.[0]?.fields?.['Parent Phone']
      || ''

    return NextResponse.json({
      success: true,
      parentName,
      parentPhone,
      email,
      students,
    })
  } catch (error) {
    console.error('Confirm GET error:', error)
    return NextResponse.json({ success: false, error: 'Lookup failed' }, { status: 500 })
  }
}

// POST: Save confirmation(s)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { parentEmail, parentName, parentPhone, confirmations } = data
    // confirmations: Array<{ studentName, className, daysAttending: string[] }>

    if (!parentEmail || !confirmations || confirmations.length === 0) {
      return NextResponse.json({ success: false, error: 'Email and confirmations required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    
    // Try writing to dedicated confirm table if it exists
    if (CONFIRM_TABLE) {
      const records = confirmations.map((c: { studentName: string; className: string; daysAttending: string[] }) => ({
        fields: {
          'Parent Email': parentEmail,
          'Parent Name': parentName || '',
          'Parent Phone': parentPhone || '',
          'Student Name': c.studentName,
          'Class': c.className,
          'Week Of': 'June 23-25, 2026',
          'Days Attending': c.daysAttending.join(', '),
          'Confirmed At': now,
          'Status': 'Confirmed',
        }
      }))

      await airtableFetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${CONFIRM_TABLE}`,
        {
          method: 'POST',
          body: JSON.stringify({ records }),
        }
      )
    }

    // Also write to Summer 2026 Registrations table as a backup/update
    for (const c of confirmations) {
      const formula = `AND({Parent Email} = '${parentEmail.replace(/'/g, "\\'")}', {Student Name} = '${(c.studentName || '').replace(/'/g, "\\'")}')`
      const lookupUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`
      const lookupRes = await airtableFetch(lookupUrl)
      const lookupData = await lookupRes.json()

      if (lookupData.records?.[0]) {
        // Update existing record with confirmation
        await airtableFetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}/${lookupData.records[0].id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              fields: {
                'Notes': `Confirmed for ${c.className} on ${c.daysAttending.join(', ')} (confirmed). Confirmed at ${now}`,
              }
            }),
          }
        )
      } else {
        // Create new record in summer table
        await airtableFetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE}/${SUMMER_TABLE}`,
          {
            method: 'POST',
            body: JSON.stringify({
              records: [{
                fields: {
                  'Student Name': c.studentName,
                  'Parent Name': parentName || '',
                  'Parent Email': parentEmail,
                  'Parent Phone': parentPhone || '',
                  'Class': c.className,
                  'Registration Date': new Date().toISOString().split('T')[0],
                  'Notes': `Confirmed for ${c.className} on ${c.daysAttending.join(', ')} (confirmed). Confirmed at ${now}`,
                  'Payment Status': 'Unpaid',
                }
              }],
            }),
          }
        )
      }
    }

    // Email notification to Miss Basma
    try {
      const studentList = confirmations.map((c: { studentName: string; className: string; daysAttending: string[] }) => 
        `${c.studentName}: ${c.className} (${c.daysAttending.join(', ')})`
      ).join('\n')
      
      await fetch('https://formsubmit.co/ajax/becomeasingermusicacademy@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `✅ Attendance Confirmed: ${parentName || parentEmail}`,
          'Parent': parentName || parentEmail,
          'Email': parentEmail,
          'Phone': parentPhone || '',
          'Students': studentList,
        }),
      })
    } catch (e) {
      console.error('Email notification error:', e)
    }

    return NextResponse.json({ success: true, count: confirmations.length })
  } catch (error) {
    console.error('Confirm POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save confirmation' }, { status: 500 })
  }
}
