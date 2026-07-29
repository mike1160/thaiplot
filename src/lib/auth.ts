import { type ProfileRow } from './supabase'
import { getSupabaseServer } from './supabase-server'

export async function getSession() {
  const supabase = await getSupabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (data as ProfileRow | null) ?? null
}

export async function requireAdmin() {
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return profile
}

export async function requireClient() {
  const profile = await getProfile()
  if (!profile) {
    throw new Error('Unauthorized')
  }
  return profile
}
