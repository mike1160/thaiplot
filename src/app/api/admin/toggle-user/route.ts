import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-api-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id.trim() : ''
    const disabled = Boolean(body?.disabled)

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const { error } = await getSupabaseAdmin()
      .from('profiles')
      .update({ disabled })
      .eq('id', id)

    if (error) {
      console.error('[toggle-user]', error)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[toggle-user]', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
