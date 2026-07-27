import { unstable_noStore as noStore } from 'next/cache'
import { getSupabaseAdmin, type ListingRow } from '@/lib/supabase'
import { FEATURED_HOMEPAGE_LISTING_ID, resolveListingCategory, resolveListingTitleDeed } from '@/lib/listing-ui'

export type PublicListing = Pick<
  ListingRow,
  | 'id'
  | 'created_at'
  | 'status'
  | 'name'
  | 'email'
  | 'phone'
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
 * photo_1–photo_5 are always requested so uploaded listing photos are never dropped.
 */
const SELECT_BASE =
  'id, created_at, name, email, phone, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at, photo_1, photo_2, photo_3, photo_4, photo_5'
const SELECT_WITH_CATEGORY =
  `${SELECT_BASE}, category, vehicle_type, vehicle_brand, vehicle_year, vehicle_mileage, condition`

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
  return ((data || []) as PublicListing[]).map((row) => ({
    ...row,
    name: row.name ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    title_deed: resolveListingTitleDeed(row),
    region: row.region || 'Hua Hin',
    category: resolveListingCategory(row),
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

async function fetchListingsWithSelect(
  url: string,
  key: string,
  select: string,
  filters: ListingFilters
): Promise<{ res: Response; raw: unknown }> {
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
  return { res, raw }
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
    // Prefer marketplace columns; fall back if category not migrated yet
    let { res, raw } = await fetchListingsWithSelect(url, key, SELECT_WITH_CATEGORY, filters)
    if (!res.ok || !Array.isArray(raw)) {
      ;({ res, raw } = await fetchListingsWithSelect(url, key, SELECT_BASE, filters))
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
          .select(SELECT_WITH_CATEGORY)
          .eq('status', 'approved')
          .order('created_at', { ascending: true })

        if (filters.region && filters.region !== 'All') {
          query = query.eq('region', filters.region)
        }
        if (filters.propertyType && filters.propertyType !== 'All') {
          query = query.eq('property_type', filters.propertyType)
        }

        let { data, error } = await query
        if (error) {
          let baseQuery = supabase
            .from('listings')
            .select(SELECT_BASE)
            .eq('status', 'approved')
            .order('created_at', { ascending: true })
          if (filters.region && filters.region !== 'All') {
            baseQuery = baseQuery.eq('region', filters.region)
          }
          if (filters.propertyType && filters.propertyType !== 'All') {
            baseQuery = baseQuery.eq('property_type', filters.propertyType)
          }
          const baseResult = await baseQuery
          data = baseResult.data as typeof data
          error = baseResult.error
        }
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

export type ListingSitemapRow = {
  id: string
  slug: string | null
  approved_at: string | null
  created_at: string
}

/** Lightweight rows for sitemap URL generation. */
export async function fetchApprovedListingsForSitemap(): Promise<ListingSitemapRow[]> {
  noStore()
  try {
    const supabase = getSupabaseAdmin()
    const withSlug = await supabase
      .from('listings')
      .select('id, slug, approved_at, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (!withSlug.error && Array.isArray(withSlug.data)) {
      return withSlug.data.map((row) => ({
        id: row.id,
        slug: (row as { slug?: string | null }).slug ?? null,
        approved_at: row.approved_at ?? null,
        created_at: row.created_at,
      }))
    }

    const base = await supabase
      .from('listings')
      .select('id, approved_at, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (base.error || !base.data) {
      console.error('[fetchApprovedListingsForSitemap]', base.error?.message || withSlug.error?.message)
      return []
    }

    return base.data.map((row) => ({
      id: row.id,
      slug: null,
      approved_at: row.approved_at ?? null,
      created_at: row.created_at,
    }))
  } catch (error) {
    console.error('[fetchApprovedListingsForSitemap]', error)
    return []
  }
}

/** Public listing by id or slug (approved only). */
export async function getListing(idOrSlug: string): Promise<PublicListing | null> {
  noStore()
  const key = (idOrSlug || '').trim()
  if (!key) return null

  try {
    const supabase = getSupabaseAdmin()

    const byId = await supabase
      .from('listings')
      .select(SELECT_WITH_CATEGORY)
      .eq('status', 'approved')
      .eq('id', key)
      .maybeSingle()

    if (!byId.error && byId.data) {
      return mapRows([byId.data as unknown as PublicListing])[0] || null
    }

    // Retry without marketplace-only columns
    if (byId.error) {
      const byIdBase = await supabase
        .from('listings')
        .select(SELECT_BASE)
        .eq('status', 'approved')
        .eq('id', key)
        .maybeSingle()
      if (!byIdBase.error && byIdBase.data) {
        return mapRows([byIdBase.data as unknown as PublicListing])[0] || null
      }
    }

    // Optional slug lookup (column may not exist yet)
    const bySlug = await supabase
      .from('listings')
      .select(SELECT_WITH_CATEGORY)
      .eq('status', 'approved')
      .eq('slug', key)
      .maybeSingle()

    if (!bySlug.error && bySlug.data) {
      return mapRows([bySlug.data as unknown as PublicListing])[0] || null
    }

    return null
  } catch (error) {
    console.error('[getListing]', error)
    return null
  }
}

export function listingPublicPath(listing: { id: string; slug?: string | null }): string {
  const slug = (listing.slug || '').trim()
  return `/listings/${slug || listing.id}`
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
