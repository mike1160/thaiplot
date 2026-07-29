import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getSupabaseServer } from '@/lib/supabase-server'

const ALLOWED_FIELDS = [
  'description',
  'price',
  'location',
  'region',
  'phone',
  'line_id',
  'whatsapp',
  'contact_preferences',
  'photo_1',
  'photo_2',
  'photo_3',
  'photo_4',
  'photo_5',
] as const

type AllowedField = (typeof ALLOWED_FIELDS)[number]

const OWNER_SELECT =
  'id, user_id, property_type, location, description, price, region, phone, line_id, whatsapp, contact_preferences, slug, status, photo_1, photo_2, photo_3, photo_4, photo_5'

async function requireOwnerListing(id: string, userId: string) {
  const admin = getSupabaseAdmin()
  const { data: listing, error } = await admin
    .from('listings')
    .select(OWNER_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error || !listing) {
    return { error: NextResponse.json({ error: 'Listing not found' }, { status: 404 }) as NextResponse }
  }
  if (!listing.user_id || listing.user_id !== userId) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) as NextResponse }
  }
  return { listing, admin }
}

export async function GET(req: NextRequest) {
  try {
    const supabaseAuth = await getSupabaseServer()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = req.nextUrl.searchParams.get('id')?.trim() || ''
    if (!id) {
      return NextResponse.json({ error: 'Missing listing id' }, { status: 400 })
    }

    const result = await requireOwnerListing(id, user.id)
    if (result.error) return result.error

    return NextResponse.json({ listing: result.listing })
  } catch (error) {
    console.error('[update-listing GET]', error)
    return NextResponse.json({ error: 'Failed to load listing' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabaseAuth = await getSupabaseServer()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    if (!id) {
      return NextResponse.json({ error: 'Missing listing id' }, { status: 400 })
    }

    const result = await requireOwnerListing(id, user.id)
    if (result.error || !result.admin) return result.error!

    const updates: Partial<Record<AllowedField, unknown>> = {}

    for (const key of ALLOWED_FIELDS) {
      if (!(key in body)) continue

      if (key === 'contact_preferences') {
        const prefs = Array.isArray(body.contact_preferences)
          ? body.contact_preferences.map((p: unknown) => String(p || '').trim()).filter(Boolean)
          : []
        updates.contact_preferences = prefs.length ? prefs : null
        continue
      }

      const raw = body[key]
      if (raw === null || raw === undefined) {
        updates[key] = null
        continue
      }
      const value = String(raw).trim()
      updates[key] = value || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { error: updateError } = await result.admin
      .from('listings')
      .update(updates)
      .eq('id', id)

    if (updateError) {
      console.error('[update-listing]', updateError)
      return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[update-listing]', error)
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
  }
}
