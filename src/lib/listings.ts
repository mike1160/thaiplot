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

export async function fetchApprovedListings(
  filters: ListingFilters = {}
): Promise<PublicListing[]> {
  try {
    const supabase = getSupabasePublic()
    const selectWithCategory =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at, photo_1, photo_2, photo_3, photo_4, photo_5, category, vehicle_type, vehicle_brand, vehicle_year, vehicle_mileage, condition'
    const selectWithRegion =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at, photo_1, photo_2, photo_3, photo_4, photo_5'
    const selectWithoutRegion =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, approved_at, photo_1, photo_2, photo_3, photo_4, photo_5'
    const selectWithoutPhotos =
      'id, created_at, status, property_type, transaction_type, location, size, price, title_deed, description, region, approved_at'

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

    let { data, error } = await runQuery(selectWithCategory, true)

    // Fallback if marketplace columns are not migrated yet
    if (error && /(category|vehicle_|condition)/i.test(error.message || '')) {
      ;({ data, error } = await runQuery(selectWithRegion, true))
    }

    // Fallback if photo columns are not migrated yet
    if (error && /photo_/i.test(error.message || '')) {
      ;({ data, error } = await runQuery(selectWithoutPhotos, true))
    }

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
