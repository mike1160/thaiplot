import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const listingId = typeof body.listing_id === 'string' ? body.listing_id.trim() : ''
    const listingLocation =
      typeof body.listing_location === 'string' ? body.listing_location.trim() : null
    const locale = typeof body.locale === 'string' ? body.locale.trim() : null

    if (!listingId) {
      return NextResponse.json({ ok: false, error: 'listing_id required' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || null
    const referrer =
      request.headers.get('referer') || request.headers.get('referrer') || null

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('listing_clicks').insert({
      listing_id: listingId,
      listing_location: listingLocation,
      user_agent: userAgent,
      referrer,
      locale,
    })

    if (error) {
      console.error('listing_clicks insert failed', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 })
  }
}
