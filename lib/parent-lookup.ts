import { airtableString } from './escape'

const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

export interface ParentRecord {
  id: string
  email: string
  phone: string
  parentName: string
}

/** Finds a parent in Airtable Leads by email, then matches the last 10 phone digits. */
export async function findParent(email: string, phone: string): Promise<ParentRecord | null> {
  const pat = process.env.AIRTABLE_PAT
  const base = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
  if (!pat) return null

  const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10)
  if (cleanPhone.length < 7) return null

  const url = new URL(`https://api.airtable.com/v0/${base}/${LEADS_TABLE}`)
  url.searchParams.set('filterByFormula', `LOWER({Email}) = ${airtableString(email.trim().toLowerCase())}`)
  url.searchParams.set('maxRecords', '100')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${pat}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()

  for (const record of data.records || []) {
    const recordPhone = String(record.fields?.['Phone'] || '').replace(/\D/g, '').slice(-10)
    if (recordPhone && recordPhone === cleanPhone) {
      return {
        id: record.id,
        email: record.fields?.['Email'] || email,
        phone: record.fields?.['Phone'] || phone,
        parentName: record.fields?.['Full Name'] || record.fields?.['Name'] || record.fields?.['Parent Name'] || '',
      }
    }
  }
  return null
}
