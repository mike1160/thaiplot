import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getSupabaseServer } from '@/lib/supabase-server'
import { requestClientIp, verifyTurnstileToken } from '@/lib/turnstile'

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
    const { name, email, description, region, budget, locale, turnstileToken } =
      await req.json()

    const supabaseAuth = await getSupabaseServer()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()
    const isAuthenticated = !!user

    if (!isAuthenticated) {
      const turnstile = await verifyTurnstileToken(turnstileToken, requestClientIp(req))
      if (!turnstile.ok) {
        return NextResponse.json({ error: 'Security check failed' }, { status: 400 })
      }
    }

    const nameValue = String(name || '').trim()
    const emailValue = String(email || '').trim()
    const descriptionValue = String(description || '').trim()
    const regionValue = String(region || '').trim() || null
    const budgetValue = String(budget || '').trim() || null
    const localeValue = String(locale || 'en').trim() || 'en'

    if (!nameValue || !emailValue || !descriptionValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (descriptionValue.length < 20) {
      return NextResponse.json(
        { error: 'Description must be at least 20 characters' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    const { error: insertError } = await supabase.from('search_requests').insert({
      name: nameValue,
      email: emailValue,
      description: descriptionValue,
      region: regionValue,
      budget: budgetValue,
      locale: localeValue,
    })

    if (insertError) {
      console.error('[search-request]', insertError)
      return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
    }

    await resend.emails.send({
      from: 'ThaiPlot <noreply@hua-hin-land.com>',
      to: 'kleinjansmike@gmail.com',
      reply_to: emailValue,
      subject: 'Nieuwe zoekopdracht via ThaiPlot',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C8973A; margin-bottom: 24px;">Nieuwe zoekopdracht via ThaiPlot</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Name</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(nameValue)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0; color: #C8973A;"><a href="mailto:${escapeHtml(emailValue)}" style="color: #C8973A;">${escapeHtml(emailValue)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; vertical-align: top;">Looking for</td><td style="padding: 8px 0; color: #f0f4ff; white-space: pre-wrap;">${escapeHtml(descriptionValue)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Region</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(regionValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Budget</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(budgetValue) || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Locale</td><td style="padding: 8px 0; color: #f0f4ff;">${escapeHtml(localeValue)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Source</td><td style="padding: 8px 0; color: #f0f4ff;">${isAuthenticated ? 'Portal (authenticated)' : 'Exit-intent / public'}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #1e2a4a; border-radius: 8px;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">Sent from thaiplot.com · ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
