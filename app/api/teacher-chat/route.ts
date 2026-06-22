import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'
const SUMMER_TABLE = 'tblfOnRDkfgZoCF9X'
const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || '1515'

/* ─── Airtable helpers ─── */

async function fetchAllRecords(tableId: string) {
  const all: { id: string; fields: Record<string, any>; createdTime: string }[] = []
  let offset: string | undefined
  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${tableId}?${params}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    })
    if (!res.ok) break
    const data = await res.json()
    all.push(...(data.records || []))
    offset = data.offset
  } while (offset)
  return all
}

async function airtablePatch(table: string, recordId: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}/${recordId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
  return res.json()
}

async function airtableGet(table: string, formula: string) {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${table}`)
  url.searchParams.set('filterByFormula', formula)
  url.searchParams.set('pageSize', '100')
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  })
  const data = await res.json()
  return data.records || []
}

/* ─── Build student summary for LLM context ─── */

function buildStudentSummary(leadRecords: any[], summerRecords: any[]): string {
  const summerByName: Record<string, any> = {}
  for (const r of summerRecords) {
    const name = (r.fields['Student Name'] || '').toLowerCase().trim()
    if (name) summerByName[name] = r.fields
  }

  const students: string[] = []
  const seen = new Set<string>()

  for (const r of leadRecords) {
    const f = r.fields
    const studentName = (f['Student Name'] || '').trim()
    if (!studentName) continue
    const key = `${studentName.toLowerCase()}|${(f.Email || '').toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)

    const summer = summerByName[studentName.toLowerCase()] || {}
    students.push(
      `- Record ID: ${r.id} | Student: ${studentName} | Age: ${f['Student Age'] || '?'} | ` +
      `Parent: ${f['Full Name'] || '?'} | Email: ${f.Email || '?'} | Phone: ${f.Phone || '?'} | ` +
      `Interests: ${f.Interests || '?'} | Source: ${f.Source || '?'} | ` +
      `Allergies: ${summer.Allergies || '?'} | Medical: ${summer['Medical Conditions'] || '?'} | ` +
      `Emergency: ${summer['Emergency Contact Name'] || '?'} / ${summer['Emergency Contact Phone'] || '?'}`
    )
  }

  return students.join('\n')
}

/* ─── System prompt ─── */

const SYSTEM_PROMPT = `You are Miss Basma's Admin Assistant on the BASMA Academy Teacher Portal. You help her look up and update student/family information efficiently.

CAPABILITIES:
1. LOOK UP student info — search by name, parent name, phone, or email
2. UPDATE student info — change phone, email, parent name, allergies, medical conditions, emergency contact, student age, interests
3. ANSWER QUESTIONS about the student roster

IMPORTANT RULES:
- Be concise and helpful — respond in 1-3 sentences max
- When the user asks to change/update info, identify the student and field, confirm the change, then output an ACTION tag
- When you identify a match and are ready to make a change, output EXACTLY this format:
  [ACTION: UPDATE record_id=XXXXX field=FIELD_NAME value=NEW_VALUE table=leads_or_summer]
- Valid fields for leads table: Student Name, Student Age, Full Name (parent), Email, Phone, Interests
- Valid fields for summer table: Allergies, Medical Conditions, Emergency Contact Name, Emergency Contact Phone
- If a student has a summer record, use table=summer for health/safety fields
- If multiple students match, list them and ask which one
- If no match, say so clearly
- Never reveal record IDs to the user — use them only in ACTION tags
- Always confirm what you're about to change before outputting the ACTION tag
- You can handle multiple updates in one response — output multiple ACTION tags

STUDENT DATABASE:
{STUDENT_DATA}
`

export async function POST(req: NextRequest) {
  try {
    const { messages, teacherCode } = await req.json()

    // Verify teacher code
    if (teacherCode !== TEACHER_CODE) {
      return NextResponse.json({ error: 'Invalid teacher code' }, { status: 403 })
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    // Fetch current student data for context
    const [leadRecords, summerRecords] = await Promise.all([
      fetchAllRecords(LEADS_TABLE),
      fetchAllRecords(SUMMER_TABLE),
    ])

    const studentSummary = buildStudentSummary(leadRecords, summerRecords)
    const systemPrompt = SYSTEM_PROMPT.replace('{STUDENT_DATA}', studentSummary)

    // Validate and sanitize messages
    const validatedMessages = messages
      .filter((m: any) => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .slice(-15)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 2000) }))

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://basmaworld.com',
        'X-Title': 'BASMA Teacher Admin Chat',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          ...validatedMessages,
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errBody = await response.text().catch(() => '')
      console.error('Teacher chat OpenRouter error:', response.status, errBody.slice(0, 200))
      return NextResponse.json({ reply: 'Service temporarily unavailable. Please try again.' }, { status: 500 })
    }

    const data = await response.json()
    let reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that request.'

    // Process ACTION tags — execute Airtable updates
    const actionRegex = /\[ACTION: UPDATE record_id=(\S+) field=(.+?) value=(.+?) table=(\w+)\]/g
    const updates: { success: boolean; field: string; value: string }[] = []
    let match

    while ((match = actionRegex.exec(reply)) !== null) {
      const [, recordId, field, value, table] = match
      try {
        if (table === 'summer') {
          // Find summer record by looking up the lead record's student name
          const leadRecord = leadRecords.find(r => r.id === recordId)
          const studentName = leadRecord?.fields['Student Name'] || ''
          if (studentName) {
            const escapedName = studentName.replace(/"/g, '\\"')
            const summerRecs = await airtableGet(SUMMER_TABLE, `{Student Name}="${escapedName}"`)
            if (summerRecs.length > 0) {
              await airtablePatch(SUMMER_TABLE, summerRecs[0].id, { [field]: value })
              updates.push({ success: true, field, value })
            } else {
              updates.push({ success: false, field, value })
            }
          }
        } else {
          // Update leads table directly
          await airtablePatch(LEADS_TABLE, recordId, { [field]: value })
          updates.push({ success: true, field, value })
        }
      } catch (err) {
        console.error('Teacher chat update error:', err)
        updates.push({ success: false, field, value })
      }
    }

    // Clean ACTION tags from visible reply
    const cleanReply = reply.replace(/\[ACTION:.*?\]/g, '').trim()

    // Append update results
    let finalReply = cleanReply
    if (updates.length > 0) {
      const successCount = updates.filter(u => u.success).length
      const failCount = updates.filter(u => !u.success).length
      if (successCount > 0 && failCount === 0) {
        finalReply += `\n\n✅ Updated successfully!`
      } else if (failCount > 0) {
        finalReply += `\n\n⚠️ ${successCount} updated, ${failCount} failed.`
      }
    }

    return NextResponse.json({ reply: finalReply, updates })
  } catch (err) {
    console.error('Teacher chat error:', err)
    return NextResponse.json({ reply: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
