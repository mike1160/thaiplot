import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

function htmlPage(title: string, message: string, ok: boolean) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, sans-serif; background: #FAF7F0; color: #1A2744; }
    .card { background: #fff; border: 1px solid #E8E2D6; border-radius: 12px; padding: 32px 40px;
      max-width: 420px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
    h1 { margin: 0 0 8px; font-size: 22px; }
    p { margin: 0; color: #5C5247; font-size: 14px; }
    .ok { color: #16a34a; }
    .err { color: #dc2626; }
  </style>
</head>
<body>
  <div class="card">
    <h1 class="${ok ? 'ok' : 'err'}">${message}</h1>
    <p>You can close this tab.</p>
  </div>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')
  const secret = searchParams.get('secret')
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || !secret || secret !== adminSecret) {
    return new NextResponse(htmlPage('Unauthorized', '❌ Unauthorized.', false), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  if (!id || (action !== 'approve' && action !== 'reject')) {
    return new NextResponse(htmlPage('Invalid', '❌ Invalid request.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, email, name, status')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return new NextResponse(htmlPage('Not found', '❌ Listing not found.', false), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const now = new Date().toISOString()
    const updates =
      action === 'approve'
        ? { status: 'approved', approved_at: now, rejected_at: null }
        : { status: 'rejected', rejected_at: now }

    const { error: updateError } = await supabase.from('listings').update(updates).eq('id', id)

    if (updateError) {
      console.error(updateError)
      return new NextResponse(htmlPage('Error', '❌ Failed to update listing.', false), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    if (listing.email) {
      const isApprove = action === 'approve'
      await resend.emails.send({
        from: 'ThaiPlot <noreply@hua-hin-land.com>',
        to: listing.email,
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
    }

    const message = action === 'approve' ? '✅ Listing approved.' : '❌ Listing rejected.'
    return new NextResponse(htmlPage('Done', message, action === 'approve'), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse(htmlPage('Error', '❌ Something went wrong.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
