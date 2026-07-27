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

const LAND_PHOTO =
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
const SOI_112_FALLBACK =
  'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=800'
const VILLA_PHOTO =
  'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=800'
const CONDO_PHOTO =
  'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800'

/** Local gallery fallbacks keyed by listing location (used until photo_* columns are set). */
const PHOTOS_BY_LOCATION: Array<{ match: (loc: string) => boolean; photos: string[] }> = [
  {
    match: (loc) => loc.includes('soi 112'),
    photos: ['/soi112-1.jpg', '/soi112-2.jpg', '/soi112-3.jpg', '/soi112-4.jpg', '/soi112-5.jpg'],
  },
  {
    match: (loc) => loc.includes('wang phong'),
    photos: ['/khao-tao-1.jpg', '/khao-tao-2.jpg', '/khao-tao-3.jpg'],
  },
  {
    match: (loc) => loc.includes('black mountain'),
    photos: ['/black-mountain-1.jpg', '/black-mountain-2.jpg'],
  },
  {
    match: (loc) => loc.includes('khao kalok') || loc.includes('pranburi'),
    photos: ['/pranburi-1.jpg', '/pranburi-2.jpg'],
  },
  {
    match: (loc) => loc.includes('sam roi yot') || loc.includes('khao lang kan'),
    photos: ['/sam-roi-yot-1.jpg', '/sam-roi-yot-2.jpg', '/sam-roi-yot-3.jpg', '/sam-roi-yot-4.jpg'],
  },
]

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

export function listingPhotosForLocation(
  location?: string | null,
  size?: string | null
): string[] {
  const loc = (location || '').toLowerCase()
  const sizeText = (size || '').toLowerCase()

  // Distinguish the two Soi 105 plots by price/size cue in seed data
  if (loc.includes('soi 105') && !loc.includes('wang phong')) {
    if (sizeText.includes('1,800') || sizeText.includes('3,600,000') || sizeText.includes('฿1,800')) {
      return ['/soi105b-1.jpg', '/soi105b-2.jpg', '/soi105b-3.jpg']
    }
    // Prefer size for the ฿2.5M/rai plot; also handle via price in callers
    if (sizeText.includes('2 rai')) {
      return ['/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg']
    }
    return ['/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg']
  }

  for (const entry of PHOTOS_BY_LOCATION) {
    if (entry.match(loc)) return entry.photos
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

  const price = (listing.price || '').toLowerCase()
  const loc = (listing.location || '').toLowerCase()
  if (loc.includes('soi 105') && !loc.includes('wang phong')) {
    if (price.includes('1,800,000') || price.includes('3,600,000')) {
      return ['/soi105b-1.jpg', '/soi105b-2.jpg', '/soi105b-3.jpg']
    }
    if (price.includes('2,500,000') || price.includes('5,000,000')) {
      return ['/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg']
    }
  }

  const byLocation = listingPhotosForLocation(listing.location, listing.size)
  if (byLocation.length > 0) return byLocation

  return [listingPhotoUrl(listing.property_type, listing.location)]
}

export function listingPhotoUrl(
  propertyType: string | null | undefined,
  location?: string | null
): string {
  const type = (propertyType || '').toLowerCase()
  const loc = (location || '').toLowerCase()

  if (loc.includes('soi 112')) {
    return '/soi112-1.jpg'
  }
  if (type.includes('villa')) {
    return VILLA_PHOTO
  }
  if (type.includes('condo')) {
    return CONDO_PHOTO
  }
  return LAND_PHOTO
}

/** Fallback if hero image is unavailable for Soi 112 */
export const SOI_112_PHOTO_FALLBACK = SOI_112_FALLBACK

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
