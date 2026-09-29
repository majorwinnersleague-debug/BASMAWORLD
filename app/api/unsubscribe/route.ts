import { NextRequest, NextResponse } from 'next/server'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

function email(v: string) { return String(v || '').trim().toLowerCase() }

async function findLeads(e: string) {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}`)
  url.searchParams.set('filterByFormula', `LOWER({Email})="${e.replace(/"/g, '\\\"')}"`)
  url.searchParams.set('pageSize','100')
  const res = await fetch(url.toString(), { headers:{Authorization:`Bearer ${AIRTABLE_PAT}`}, cache:'no-store' })
  if (!res.ok) throw new Error('Airtable lookup failed')
  return (await res.json()).records || []
}

async function updateLead(id: string, fields: Record<string, unknown>) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}/${id}`, {
    method:'PATCH',
    headers:{Authorization:`Bearer ${AIRTABLE_PAT}`,'Content-Type':'application/json'},
    body:JSON.stringify({fields}),
  })
  if (!res.ok) throw new Error('Airtable update failed')
}

export async function GET(req: NextRequest) {
  const e=email(new URL(req.url).searchParams.get('email') || '')
  if (!e || !e.includes('@')) return NextResponse.json({error:'A valid email is required.'},{status:400})
  return NextResponse.json({success:true,email:e})
}

export async function POST(req: NextRequest) {
  try {
    const body=await req.json()
    const e=email(body.email)
    const reason=String(body.reason || '').trim()
    const confirm=body.confirm === true
    if (!e || !e.includes('@')) return NextResponse.json({error:'A valid email is required.'},{status:400})
    if (!reason) return NextResponse.json({error:'Please select a reason.'},{status:400})
    if (!confirm) return NextResponse.json({success:true,needsConfirmation:true})
    if (!AIRTABLE_PAT) return NextResponse.json({error:'Unsubscribe is temporarily unavailable.'},{status:503})
    const records=await findLeads(e)
    if (!records.length) return NextResponse.json({success:true,unsubscribed:true})
    await Promise.all(records.map((r:any)=>updateLead(r.id,{
      'Marketing Opt Out': true,
      'Email Updates': false,
      'Unsubscribe Reason': reason,
      'Unsubscribed At': new Date().toISOString(),
    })))
    return NextResponse.json({success:true,unsubscribed:true})
  } catch (err) {
    console.error('Unsubscribe error:',err)
    return NextResponse.json({error:'We could not complete the unsubscribe request. Please try again.'},{status:500})
  }
}
