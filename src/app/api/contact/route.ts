import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'ThaiPlot <noreply@hua-hin-land.com>',
      to: 'kleinjansmike@gmail.com',
      reply_to: email,
      subject: `New enquiry — ThaiPlot`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C8973A; margin-bottom: 24px;">New enquiry — ThaiPlot</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 120px;">Name</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0; color: #C8973A;"><a href="mailto:${escapeHtml(email)}" style="color: #C8973A;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Phone</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(phone) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Message</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(message)}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #1e2a4a; border-radius: 8px;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">Sent from thaiplot.com · ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from: 'ThaiPlot <noreply@hua-hin-land.com>',
      to: email,
      subject: 'Thank you for your enquiry — ThaiPlot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C8973A; margin-bottom: 16px;">Thank you, ${escapeHtml(name)}.</h2>
          <p style="color: #cbd5e1; line-height: 1.7;">We've received your enquiry and will be in touch within 24 hours.</p>
          <p style="margin: 24px 0 0; color: #64748b; font-size: 12px;">ThaiPlot · thaiplot.com</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
