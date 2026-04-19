// ── Email send utility via Resend API ──────────────────────────────────────────

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
  from?: string
}

export interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('sendEmail: RESEND_API_KEY is not set')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  // Default from address: billy for Academy/general, basma for MWL callers pass explicitly
  const fromAddress = from || 'billy@basmaworld.com'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
        text,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', res.status, data)
      return {
        success: false,
        error: data?.message || `Resend error ${res.status}`,
      }
    }

    console.log(`Email sent via Resend: id=${data.id} to=${to} subject="${subject}"`)
    return { success: true, id: data.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('sendEmail fetch error:', message)
    return { success: false, error: message }
  }
}
