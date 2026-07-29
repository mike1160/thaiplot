import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdminApi } from '@/lib/admin-api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const location = typeof body?.location === 'string' ? body.location.trim() : ''
    const reden = typeof body?.reden === 'string' ? body.reden.trim() : ''

    if (!id || !reden) {
      return NextResponse.json({ error: 'Missing id or reden' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const { error } = await getSupabaseAdmin()
      .from('listings')
      .update({ status: 'rejected', rejected_at: now })
      .eq('id', id)

    if (error) {
      console.error('[reject-with-reason]', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    if (email && email.includes('@')) {
      await resend.emails.send({
        from: 'ThaiPlot <noreply@hua-hin-land.com>',
        to: email,
        subject: 'Uw aanbieding is niet goedgekeurd — ThaiPlot',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
            <h2 style="color: #C8973A; margin-bottom: 16px;">Aanbieding niet goedgekeurd</h2>
            <p style="color: #cbd5e1; line-height: 1.7;">
              Beste ${escapeHtml(name || 'klant')},
            </p>
            <p style="color: #cbd5e1; line-height: 1.7;">
              Uw aanbieding ${escapeHtml(location || '—')} is helaas niet goedgekeurd.
            </p>
            <p style="color: #cbd5e1; line-height: 1.7;">
              <strong>Reden:</strong> ${escapeHtml(reden)}
            </p>
            <p style="color: #cbd5e1; line-height: 1.7;">
              Heeft u vragen? Neem contact op via
              <a href="https://www.thaiplot.com/contact" style="color: #C8973A;">thaiplot.com/contact</a>.
            </p>
            <p style="margin: 24px 0 0; color: #64748b; font-size: 12px;">ThaiPlot · thaiplot.com</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reject-with-reason]', error)
    return NextResponse.json({ error: 'Reject failed' }, { status: 500 })
  }
}
