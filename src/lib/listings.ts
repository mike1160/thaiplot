import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { FEATURED_HOMEPAGE_LISTING_ID, resolveListingCategory, resolveListingTitleDeed } from '@/lib/listing-ui'

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
 * Prefer marketplace columns when present. Falls back if DB not migrated yet.
 */
const SELECT_WITH_CATEGORY =
  'id, created_at, name, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at, category, photo_1, photo_2, photo_3, photo_4, photo_5, vehicle_type, vehicle_brand, vehicle_year, vehicle_mileage, condition'
const SELECT_BASE =
  'id, created_at, name, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at'

type SortableRow = {
  id: string
  name?: string | null
  created_at: string
}

const THANATHIP_NAME = 'thanathip'

/**
 * Equivalent to:
 * ORDER BY
 *   CASE WHEN id = featured THEN 0
 *        WHEN name = 'Thanathip' THEN 1
 *        ELSE 2 END ASC,
 *   created_at ASC
 *
 * Non-Thanathip listings (e.g. the Longtail boat) always come after all Thanathip rows.
 */
function listingSortPriority(row: SortableRow): number {
  if (row.id === FEATURED_HOMEPAGE_LISTING_ID) return 0
  if ((row.name || '').trim().toLowerCase() === THANATHIP_NAME) return 1
  return 2
}

export function sortListingsFeaturedThanathipFirst<T extends SortableRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const priorityDiff = listingSortPriority(a) - listingSortPriority(b)
    if (priorityDiff !== 0) return priorityDiff
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

function mapRows(data: unknown[] | null): PublicListing[] {
  return ((data || []) as (PublicListing & { name?: string | null })[]).map((row) => {
    const { name: _name, ...rest } = row
    return {
      ...rest,
      title_deed: resolveListingTitleDeed(rest),
      region: rest.region || 'Hua Hin',
      category: resolveListingCategory(rest),
      vehicle_type: rest.vehicle_type ?? null,
      vehicle_brand: rest.vehicle_brand ?? null,
      vehicle_year: rest.vehicle_year ?? null,
      vehicle_mileage: rest.vehicle_mileage ?? null,
      condition: rest.condition ?? null,
      photo_1: rest.photo_1 ?? null,
      photo_2: rest.photo_2 ?? null,
      photo_3: rest.photo_3 ?? null,
      photo_4: rest.photo_4 ?? null,
      photo_5: rest.photo_5 ?? null,
    }
  })
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

  const limit = typeof filters.limit === 'number' ? filters.limit : undefined

  try {
    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    } as const

    async function fetchWithSelect(select: string) {
      const params = new URLSearchParams()
      params.set('status', 'eq.approved')
      params.set('select', select)
      // Fetch oldest-first so we can re-sort in app (PostgREST has no CASE WHEN order)
      params.set('order', 'created_at.asc')

      if (filters.region && filters.region !== 'All') {
        params.set('region', `eq.${filters.region}`)
      }
      if (filters.propertyType && filters.propertyType !== 'All') {
        params.set('property_type', `eq.${filters.propertyType}`)
      }

      const endpoint = `${url!.replace(/\/$/, '')}/rest/v1/listings?${params.toString()}`
      const res = await fetch(endpoint, {
        method: 'GET',
        headers,
        cache: 'no-store',
      })
      const raw = await res.json()
      return { res, raw }
    }

    // Prefer marketplace columns; fall back if category not migrated yet
    let { res, raw } = await fetchWithSelect(SELECT_WITH_CATEGORY)
    if (!res.ok || !Array.isArray(raw)) {
      ;({ res, raw } = await fetchWithSelect(SELECT_BASE))
    }

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
          .select(SELECT_BASE)
          .eq('status', 'approved')
          .order('created_at', { ascending: true })

        if (filters.region && filters.region !== 'All') {
          query = query.eq('region', filters.region)
        }
        if (filters.propertyType && filters.propertyType !== 'All') {
          query = query.eq('property_type', filters.propertyType)
        }

        const { data, error } = await query
        console.log('[fetchApprovedListings] admin fallback', {
          error: error?.message,
          count: data?.length ?? null,
        })
        if (error || !data) return []
        const sorted = sortListingsFeaturedThanathipFirst(
          data as unknown as SortableRow[]
        )
        const limited = typeof limit === 'number' ? sorted.slice(0, limit) : sorted
        return mapRows(limited as unknown as unknown[])
      } catch (fallbackError) {
        console.error('[fetchApprovedListings] admin fallback failed', fallbackError)
        return []
      }
    }

    const sorted = sortListingsFeaturedThanathipFirst(raw as SortableRow[])
    const limited = typeof limit === 'number' ? sorted.slice(0, limit) : sorted
    return mapRows(limited as unknown as unknown[])
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
