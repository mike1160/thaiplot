import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const ALLOWED = ['description', 'price', 'location', 'region', 'slug'] as const

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (!(key in body)) continue
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

    const { error } = await getSupabaseAdmin().from('listings').update(updates).eq('id', id)
    if (error) {
      console.error('[admin/update-listing]', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/update-listing]', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
