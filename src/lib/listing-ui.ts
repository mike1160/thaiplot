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

export const LAND_PHOTOS = [
  'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg',
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
  'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg',
  'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
  'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg',
  'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
]

const VILLA_PHOTO = 'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg'
const CONDO_PHOTO = 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'

function withPhotoParams(url: string): string {
  return `${url}?auto=compress&w=800`
}

export function listingPhotoUrl(
  propertyType: string | null | undefined,
  index = 0
): string {
  const type = (propertyType || '').toLowerCase()
  if (type.includes('villa')) {
    return withPhotoParams(VILLA_PHOTO)
  }
  if (type.includes('condo')) {
    return withPhotoParams(CONDO_PHOTO)
  }
  // Land, house, commercial, default — rotate Thailand land photos by index
  return withPhotoParams(LAND_PHOTOS[index % LAND_PHOTOS.length])
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
