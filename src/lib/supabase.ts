import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

/** Next.js caches fetch by default — always bypass for Supabase. */
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' })

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
      global: { fetch: noStoreFetch },
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
      global: { fetch: noStoreFetch },
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
  photo_1: string | null
  photo_2: string | null
  photo_3: string | null
  photo_4: string | null
  photo_5: string | null
  category: string | null
  vehicle_type: string | null
  vehicle_brand: string | null
  vehicle_year: string | null
  vehicle_mileage: string | null
  condition: string | null
}
