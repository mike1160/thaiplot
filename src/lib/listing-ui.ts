export const PROPERTY_TYPES = [
  'All',
  'Land',
  'House',
  'Villa',
  'Condo',
  'Commercial',
] as const

export const FILTER_REGIONS = [
  'All',
  'Hua Hin',
  'Pranburi',
  'Cha-am',
  'Prachuap Khiri Khan',
  'Phuket',
  'Koh Samui',
  'Chiang Mai',
  'Bangkok',
  'Pattaya',
  'Krabi',
  'Koh Phangan',
  'Rayong',
  'Other',
] as const

export const TRANSACTIONS = ['For Sale', 'For Rent', 'Both'] as const

export type ListingFiltersState = {
  propertyType: string
  region: string
  transaction: string
}

export const DEFAULT_FILTERS: ListingFiltersState = {
  propertyType: 'All',
  region: 'All',
  transaction: 'For Sale',
}

export function listingPhotoUrl(propertyType: string | null | undefined): string {
  const type = (propertyType || '').toLowerCase()
  if (type.includes('land')) {
    return 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
  if (type.includes('villa')) {
    return 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
  if (type.includes('condo')) {
    return 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
  return 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=800'
}

export function matchesListingFilters<
  T extends {
    property_type?: string | null
    region?: string | null
    location?: string | null
    transaction_type?: string | null
  },
>(listing: T, filters: ListingFiltersState): boolean {
  const typeOk =
    filters.propertyType === 'All' ||
    (listing.property_type || '').toLowerCase() === filters.propertyType.toLowerCase()

  const regionOk =
    filters.region === 'All' ||
    (listing.region || '').toLowerCase() === filters.region.toLowerCase() ||
    (listing.location || '').toLowerCase().includes(filters.region.toLowerCase())

  const tx = (listing.transaction_type || '').toLowerCase()
  let transactionOk = true
  if (filters.transaction === 'For Sale') {
    transactionOk = tx.includes('sale') || tx.includes('both') || !tx
  } else if (filters.transaction === 'For Rent') {
    transactionOk = tx.includes('rent') || tx.includes('both')
  } else if (filters.transaction === 'Both') {
    transactionOk = true
  }

  return typeOk && regionOk && transactionOk
}
