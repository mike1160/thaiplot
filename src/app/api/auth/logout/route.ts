import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  // Prefer request origin so local admin logout stays on localhost
  const base = new URL(request.url).origin
  return NextResponse.redirect(new URL('/admin/login', base), { status: 303 })
}
