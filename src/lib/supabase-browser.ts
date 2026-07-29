'use client'

import { createBrowserClient } from '@supabase/ssr'

/** Browser client for Auth + Storage (cookie/session aware via @supabase/ssr). */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
