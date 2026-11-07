import { escapeHtml } from './escape'

/**
 * Sender for transactional mail. Set EMAIL_FROM (e.g. "BASMA Academy <no-reply@basmaworld.com>")
 * once basmaworld.com is verified in Resend. Resend's sandbox sender below can
 * only deliver to the Resend account owner.
 */
export function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'BASMA Academy <onboarding@resend.dev>'
}

export async function sendResendEmail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not configured')
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: getFromAddress(), to: opts.to, subject: opts.subject, html: opts.html }),
    })
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text())
    }
    return res.ok
  } catch (error) {
    console.error('[email] Resend exception', error)
    return false
  }
}

export async function sendLoginCodeEmail(opts: {
  to: string
  code: string
  name?: string
  portal: 'Parent Portal' | 'Teacher Portal'
}): Promise<boolean> {
  const { to, code, name, portal } = opts
  return sendResendEmail({
    to,
    subject: `Your BASMA login code: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4a0e78, #6b21a8); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #ffd700; margin: 0; font-size: 22px;">🎵 BASMA ${escapeHtml(portal)}</h2>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; color: #333;">Hi ${escapeHtml(name || 'there')},</p>
          <p style="font-size: 15px; color: #333;">Your login code is:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 16px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4a0e78;">${escapeHtml(code)}</span>
          </div>
          <p style="font-size: 13px; color: #888;">This code expires in 10 minutes and can be used once. If you didn't request it, you can ignore this email.</p>
        </div>
      </div>
    `,
  })
}
