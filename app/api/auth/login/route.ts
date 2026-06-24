import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const AIRTABLE_PAT = process.env.AIRTABLE_PAT || ''
const AIRTABLE_BASE = process.env.AIRTABLE_ACADEMY_BASE || 'appK3o119Z5r9AY6j'
const LEADS_TABLE = 'tbl1diIEhM9MtKViE'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'BASMA Academy <onboarding@resend.dev>'

/* ── Find parent in Airtable by email + phone ── */
async function findParent(email: string, phone: string) {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10)
  
  // Search by email first
  const formula = encodeURIComponent(`LOWER({Email}) = '${email.toLowerCase().trim()}'`)
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${LEADS_TABLE}?filterByFormula=${formula}&maxRecords=100`
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  })
  
  if (!res.ok) return null
  const data = await res.json()
  
  // Match by phone number (last 10 digits)
  for (const record of data.records || []) {
    const recordPhone = (record.fields?.['Phone'] || '').replace(/\D/g, '').slice(-10)
    if (recordPhone === cleanPhone) {
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

/* ── Send OTP email via Resend ── */
async function sendOTPEmail(email: string, code: string, name: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: `Your BASMA login code: ${code}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
              <h2 style="color: #ffd700; margin: 0; font-size: 22px;">🎵 BASMA Parent Portal</h2>
            </div>
            <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="font-size: 15px; color: #333;">Hi ${name || 'there'},</p>
              <p style="font-size: 15px; color: #333;">Your login code is:</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 16px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4a0e78;">${code}</span>
              </div>
              <p style="font-size: 13px; color: #888;">This code expires in 10 minutes. If you didn't request this, you can safely ignore it.</p>
            </div>
          </div>
        `,
      }),
    })
    if (!res.ok) {
      const errorBody = await res.text()
      console.error('[RESEND ERROR]', res.status, errorBody)
    }
    return res.ok
  } catch (err) {
    console.error('[RESEND EXCEPTION]', err)
    return false
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: 3 login attempts per IP per 5 minutes
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`auth-login:${ip}`, 3, 5 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  try {
    const { email, phone } = await req.json()
    
    if (!email || !phone) {
      return NextResponse.json({ error: 'Email and phone number are required.' }, { status: 400 })
    }
    
    // Find parent in Airtable
    const parent = await findParent(email, phone)
    if (!parent) {
      return NextResponse.json(
        { error: 'No account found with this email and phone number. Please register first at basmaworld.com/enroll.' },
        { status: 404 }
      )
    }
    
    // Generate and store OTP
    const code = generateOTP()
    storeOTP(email, code)
    
    // Send OTP via email
    const sent = await sendOTPEmail(email, code, parent.parentName)
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      parentName: parent.parentName,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
