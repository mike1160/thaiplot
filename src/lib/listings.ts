import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { resolveListingTitleDeed } from '@/lib/listing-ui'

export type PublicListing = Pick<
  ListingRow,
  | 'id'
  | 'created_at'
  | 'status'
  | 'property_type'
  | 'transaction_type'
  | 'location'
  | 'size'
  | 'price'
  | 'title_deed'
  | 'description'
  | 'region'
  | 'approved_at'
  | 'photo_1'
  | 'photo_2'
  | 'photo_3'
  | 'photo_4'
  | 'photo_5'
  | 'category'
  | 'vehicle_type'
  | 'vehicle_brand'
  | 'vehicle_year'
  | 'vehicle_mileage'
  | 'condition'
>

export type ListingFilters = {
  region?: string
  propertyType?: string
  limit?: number
}

/**
 * Only columns that exist on the live `listings` table.
 * (category / photo_* / vehicle_* are not migrated yet)
 */
const BASE_SELECT =
  'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at'

function mapRows(data: unknown[] | null): PublicListing[] {
  return ((data || []) as PublicListing[]).map((row) => ({
    ...row,
    title_deed: resolveListingTitleDeed(row),
    region: row.region || 'Hua Hin',
    category: row.category || 'Land & Property',
    vehicle_type: row.vehicle_type ?? null,
    vehicle_brand: row.vehicle_brand ?? null,
    vehicle_year: row.vehicle_year ?? null,
    vehicle_mileage: row.vehicle_mileage ?? null,
    condition: row.condition ?? null,
    photo_1: row.photo_1 ?? null,
    photo_2: row.photo_2 ?? null,
    photo_3: row.photo_3 ?? null,
    photo_4: row.photo_4 ?? null,
    photo_5: row.photo_5 ?? null,
  }))
}

export async function fetchApprovedListings(
  filters: ListingFilters = {}
): Promise<PublicListing[]> {
  noStore()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const key = serviceKey || anonKey

  if (!url || !key) {
    console.error('[fetchApprovedListings] missing env', {
      hasUrl: Boolean(url),
      hasServiceKey: Boolean(serviceKey),
      hasAnonKey: Boolean(anonKey),
    })
    return []
  }

  try {
    // Direct REST call — avoids supabase-js + Next fetch cache pitfalls
    const params = new URLSearchParams()
    params.set('status', 'eq.approved')
    params.set('select', BASE_SELECT)
    params.set('order', 'approved_at.desc.nullslast')

    if (filters.region && filters.region !== 'All') {
      params.set('region', `eq.${filters.region}`)
    }
    if (filters.propertyType && filters.propertyType !== 'All') {
      params.set('property_type', `eq.${filters.propertyType}`)
    }
    if (typeof filters.limit === 'number') {
      params.set('limit', String(filters.limit))
    }

    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/listings?${params.toString()}`
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
    })

    const raw = await res.json()

    console.log('[fetchApprovedListings] raw Supabase response', {
      ok: res.ok,
      status: res.status,
      using: serviceKey ? 'service_role' : 'anon',
      count: Array.isArray(raw) ? raw.length : null,
      error: !Array.isArray(raw) ? raw : null,
      sample: Array.isArray(raw) && raw[0] ? raw[0] : null,
    })

    if (!res.ok || !Array.isArray(raw)) {
      // Last resort: supabase-js admin client
      try {
        const supabase = getSupabaseAdmin()
        let query = supabase
          .from('listings')
          .select(BASE_SELECT)
          .eq('status', 'approved')
          .order('approved_at', { ascending: false })

        if (filters.region && filters.region !== 'All') {
          query = query.eq('region', filters.region)
        }
        if (filters.propertyType && filters.propertyType !== 'All') {
          query = query.eq('property_type', filters.propertyType)
        }
        if (typeof filters.limit === 'number') {
          query = query.limit(filters.limit)
        }

        const { data, error } = await query
        console.log('[fetchApprovedListings] admin fallback', {
          error: error?.message,
          count: data?.length ?? null,
        })
        if (error || !data) return []
        return mapRows(data as unknown as unknown[])
      } catch (fallbackError) {
        console.error('[fetchApprovedListings] admin fallback failed', fallbackError)
        return []
      }
    }

    return mapRows(raw)
  } catch (error) {
    console.error('[fetchApprovedListings] exception', error)
    return []
  }
}

export function truncateText(value: string | null | undefined, max: number): string {
  const text = (value || '').trim()
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

export function transactionBadgeKey(
  transaction: string | null
): 'badgeSale' | 'badgeRent' | 'badgeBoth' {
  const value = (transaction || '').toLowerCase()
  if (value.includes('both')) return 'badgeBoth'
  if (value.includes('rent')) return 'badgeRent'
  return 'badgeSale'
}
