import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdminApi } from '@/lib/admin-api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thaiplot.com').replace(
      /\/$/,
      ''
    )
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=/portal/new-password`,
      },
    })

    if (error || !data?.properties?.action_link) {
      console.error('[reset-user-password]', error)
      return NextResponse.json({ error: 'Failed to generate reset link' }, { status: 500 })
    }

    const link = data.properties.action_link

    await resend.emails.send({
      from: 'ThaiPlot <noreply@hua-hin-land.com>',
      to: email,
      subject: 'Wachtwoord resetten — ThaiPlot Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #C8973A; margin-bottom: 16px;">Wachtwoord resetten</h2>
          <p style="color: #cbd5e1; line-height: 1.7;">Beste gebruiker,</p>
          <p style="color: #cbd5e1; line-height: 1.7;">
            Klik op onderstaande link om uw wachtwoord te resetten:
          </p>
          <p style="margin: 24px 0;">
            <a href="${link}" style="display: inline-block; padding: 14px 22px; background: #C8973A; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Wachtwoord resetten
            </a>
          </p>
          <p style="color: #94a3b8; font-size: 13px;">Deze link is 24 uur geldig.</p>
          <p style="margin: 24px 0 0; color: #64748b; font-size: 12px;">ThaiPlot · thaiplot.com</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-user-password]', error)
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
