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

const HERO_FALLBACK = '/hero.jpg'

export function listingPhotosFromColumns(listing: {
  photo_1?: string | null
  photo_2?: string | null
  photo_3?: string | null
  photo_4?: string | null
  photo_5?: string | null
}): string[] {
  return [
    listing.photo_1,
    listing.photo_2,
    listing.photo_3,
    listing.photo_4,
    listing.photo_5,
  ].filter((url): url is string => Boolean(url && url.trim()))
}

/** Map listing fields to local gallery photos (price / size / location). */
export function listingPhotosForListing(listing: {
  location?: string | null
  size?: string | null
  price?: string | null
}): string[] {
  const loc = listing.location || ''
  const locLower = loc.toLowerCase()
  const price = listing.price || ''
  const priceLower = price.toLowerCase()
  const size = listing.size || ''
  const sizeLower = size.toLowerCase()

  if (locLower.includes('soi 112')) {
    return ['/soi112-1.jpg', '/soi112-2.jpg', '/soi112-3.jpg', '/soi112-4.jpg', '/soi112-5.jpg']
  }

  if (
    price.includes('10,000,000') ||
    priceLower.includes('10m') ||
    (sizeLower.includes('4 rai') && locLower.includes('khao tao'))
  ) {
    return ['/khao-tao-1.jpg', '/khao-tao-2.jpg', '/khao-tao-3.jpg']
  }

  if (
    price.includes('5,000,000') ||
    priceLower.includes('5m') ||
    (sizeLower.includes('2 rai') &&
      locLower.includes('soi 105') &&
      !locLower.includes('soi105b'))
  ) {
    return ['/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg']
  }

  if (locLower.includes('pranburi') || locLower.includes('khao kra hok')) {
    return ['/pranburi-1.jpg', '/pranburi-2.jpg']
  }

  if (locLower.includes('black mountain')) {
    return ['/black-mountain-1.jpg', '/black-mountain-2.jpg', '/black-mountain-3.jpg']
  }

  if (locLower.includes('sam roi yot')) {
    return ['/sam-roi-yot-1.jpg', '/sam-roi-yot-2.jpg', '/sam-roi-yot-3.jpg', '/sam-roi-yot-4.jpg']
  }

  if (locLower.includes('thap tai') && !locLower.includes('soi 112')) {
    return ['/soi105b-1.jpg', '/soi105b-2.jpg', '/soi105b-3.jpg']
  }

  return []
}

export function resolveListingPhotos(listing: {
  property_type?: string | null
  location?: string | null
  size?: string | null
  price?: string | null
  photo_1?: string | null
  photo_2?: string | null
  photo_3?: string | null
  photo_4?: string | null
  photo_5?: string | null
}): string[] {
  const fromColumns = listingPhotosFromColumns(listing)
  if (fromColumns.length > 0) return fromColumns

  const mapped = listingPhotosForListing(listing)
  if (mapped.length > 0) return mapped

  return [HERO_FALLBACK]
}

export function listingPhotoUrl(
  _propertyType?: string | null,
  location?: string | null
): string {
  const mapped = listingPhotosForListing({ location })
  return mapped[0] || HERO_FALLBACK
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
