import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    const status = typeof body?.status === 'string' ? body.status.trim() : ''

    if (!id || !['nieuw', 'behandeld'].includes(status)) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('search_requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('[search-request-status]', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[search-request-status]', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
