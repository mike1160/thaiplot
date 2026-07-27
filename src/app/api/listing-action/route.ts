import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminListingsUrl, adminSecretsMatch } from '@/lib/admin'
import { getSupabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

function looksLikeEmail(value: string | null | undefined): boolean {
  return !!value && value.includes('@')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')
  const secret = searchParams.get('secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecretsMatch(secret, adminSecret)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!id || (action !== 'approve' && action !== 'reject' && action !== 'delete')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const backToAdmin = adminListingsUrl(adminSecret!)

  try {
    const supabase = getSupabaseAdmin()
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, email, name, status')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.redirect(new URL(`${backToAdmin}&flash=not_found`, req.url))
    }

    if (action === 'delete') {
      const { error: deleteError } = await supabase.from('listings').delete().eq('id', id)
      if (deleteError) {
        console.error(deleteError)
        return NextResponse.redirect(new URL(`${backToAdmin}&flash=delete_error`, req.url))
      }
      return NextResponse.redirect(new URL(`${backToAdmin}&flash=deleted`, req.url))
    }

    const now = new Date().toISOString()
    const updates =
      action === 'approve'
        ? { status: 'approved', approved_at: now, rejected_at: null }
        : { status: 'rejected', rejected_at: now }

    const { error: updateError } = await supabase.from('listings').update(updates).eq('id', id)

    if (updateError) {
      console.error(updateError)
      return NextResponse.redirect(new URL(`${backToAdmin}&flash=update_error`, req.url))
    }

    if (looksLikeEmail(listing.email)) {
      const isApprove = action === 'approve'
      try {
        await resend.emails.send({
          from: 'ThaiPlot <noreply@hua-hin-land.com>',
          to: listing.email!,
          subject: isApprove
            ? 'Your listing has been accepted — ThaiPlot'
            : 'Update on your listing submission — ThaiPlot',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1120; color: #f0f4ff; padding: 32px; border-radius: 12px;">
              <h2 style="color: ${isApprove ? '#16a34a' : '#C8973A'}; margin-bottom: 16px;">
                ${isApprove ? 'Listing accepted' : 'Listing not published'}
              </h2>
              <p style="color: #cbd5e1; line-height: 1.7; margin: 0;">
                ${
                  isApprove
                    ? 'Your listing has been accepted and will appear on thaiplot.com shortly.'
                    : 'Thank you for your submission. Unfortunately your listing did not meet our criteria.'
                }
              </p>
              <p style="margin: 24px 0 0; color: #64748b; font-size: 12px;">ThaiPlot · thaiplot.com</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('[listing-action] email failed', emailError)
      }
    }

    const flash = action === 'approve' ? 'approved' : 'rejected'
    return NextResponse.redirect(new URL(`${backToAdmin}&flash=${flash}`, req.url))
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL(`${backToAdmin}&flash=error`, req.url))
  }
}
