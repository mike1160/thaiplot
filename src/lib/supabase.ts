import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

/** Service-role client — server/API only. Bypasses RLS. Never expose to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

/** Anon client — public reads of approved listings (subject to RLS). */
export function getSupabasePublic(): SupabaseClient {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}

export type ListingRow = {
  id: string
  created_at: string
  status: 'pending' | 'approved' | 'rejected' | string
  name: string | null
  email: string | null
  phone: string | null
  preferred_language: string | null
  property_type: string | null
  transaction_type: string | null
  location: string | null
  size: string | null
  price: string | null
  title_deed: string | null
  description: string | null
  region: string | null
  approved_at: string | null
  rejected_at: string | null
}
