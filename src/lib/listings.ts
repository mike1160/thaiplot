import { getSupabasePublic, type ListingRow } from '@/lib/supabase'

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
>

export type ListingFilters = {
  region?: string
  propertyType?: string
  limit?: number
}

export async function fetchApprovedListings(
  filters: ListingFilters = {}
): Promise<PublicListing[]> {
  try {
    const supabase = getSupabasePublic()
    const selectWithRegion =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at'
    const selectWithoutRegion =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, approved_at'

    const runQuery = async (select: string, useRegionFilter: boolean) => {
      let query = supabase
        .from('listings')
        .select(select)
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })

      if (useRegionFilter && filters.region && filters.region !== 'All') {
        query = query.eq('region', filters.region)
      }

      if (filters.propertyType && filters.propertyType !== 'All') {
        query = query.eq('property_type', filters.propertyType)
      }

      if (typeof filters.limit === 'number') {
        query = query.limit(filters.limit)
      }

      return query
    }

    let { data, error } = await runQuery(selectWithRegion, true)

    // Fallback if region column is not migrated yet
    if (error && /region/i.test(error.message || '')) {
      ;({ data, error } = await runQuery(selectWithoutRegion, false))
    }

    if (error) {
      console.error(error)
      return []
    }

    return ((data || []) as unknown as PublicListing[]).map((row) => ({
      ...row,
      region: row.region || 'Hua Hin',
    }))
  } catch (error) {
    console.error(error)
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
