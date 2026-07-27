import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Warn when a similar approved/pending listing already exists nearby.
 * Matches on location (ilike) and optional size.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const location = (searchParams.get('location') || '').trim()
  const size = (searchParams.get('size') || '').trim()

  if (location.length < 3) {
    return NextResponse.json({ similar: false, matches: [] })
  }

  try {
    const supabase = getSupabaseAdmin()
    let query = supabase
      .from('listings')
      .select('id, location, size, property_type, status, price')
      .in('status', ['approved', 'pending'])
      .ilike('location', `%${location}%`)
      .limit(5)

    if (size) {
      query = query.ilike('size', `%${size.split(' ')[0]}%`)
    }

    const { data, error } = await query
    if (error) {
      console.error('[check-similar-listing]', error)
      return NextResponse.json({ similar: false, matches: [] })
    }

    const matches = data || []
    return NextResponse.json({
      similar: matches.length > 0,
      matches,
    })
  } catch (error) {
    console.error('[check-similar-listing]', error)
    return NextResponse.json({ similar: false, matches: [] })
  }
}
