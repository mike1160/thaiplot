export const PROPERTY_TYPES = [
  'All',
  'Land',
  'House',
  'Villa',
  'Condo',
  'Commercial',
] as const

/** Stored category values on listings.category */
export const LISTING_CATEGORIES = [
  'Land & Property',
  'Vehicle',
  'Boat',
  'Business',
  'Other',
] as const

export type ListingCategory = (typeof LISTING_CATEGORIES)[number]

/** Filter pills: All | Land & Property | Vehicles | Boats | Businesses | Other */
export const CATEGORY_FILTERS = [
  { value: 'All', labelKey: 'catAll' as const },
  { value: 'Land & Property', labelKey: 'catLandProperty' as const },
  { value: 'Vehicle', labelKey: 'catVehicles' as const },
  { value: 'Boat', labelKey: 'catBoats' as const },
  { value: 'Business', labelKey: 'catBusinesses' as const },
  { value: 'Other', labelKey: 'catOther' as const },
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
  category: string
  propertyType: string
  region: string
  transaction: string
}

export const DEFAULT_FILTERS: ListingFiltersState = {
  category: 'All',
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

/** Map listing to local gallery photos by stable listing id (preferred). */
export function listingPhotosForListing(listing: {
  id?: string | null
  location?: string | null
  size?: string | null
  price?: string | null
}): string[] {
  const id = (listing.id || '').trim()
  const locLower = (listing.location || '').toLowerCase()

  // Khao Tao 4 rai
  if (id === '5ec523d2-9372-4770-baea-6afab15e7ba0') {
    return ['/khao-tao-1.jpg', '/khao-tao-2.jpg', '/khao-tao-3.jpg']
  }
  // Soi 105 2 rai ฿2,500,000
  if (id === 'f797ed07-6d97-4bfd-86c2-c12cf563b6b5') {
    return ['/soi105-1.jpg', '/soi105-2.jpg', '/soi105-3.jpg']
  }
  // Soi 105b 2 rai ฿1,800,000
  if (id === '4dc2784c-ba89-47c5-ba07-bd17641a0e4a') {
    return ['/soi105b-1.jpg', '/soi105b-2.jpg', '/soi105b-3.jpg']
  }
  // Sam Roi Yot
  if (id === '5561f9fa-59a5-4ec1-ab6f-6b54cc200fbe') {
    return ['/sam-roi-yot-1.jpg', '/sam-roi-yot-2.jpg', '/sam-roi-yot-3.jpg', '/sam-roi-yot-4.jpg']
  }
  // Black Mountain
  if (id === 'ffa4578f-3e68-4c54-86d7-9fd32df05cf3') {
    return ['/black-mountain-1.jpg', '/black-mountain-2.jpg', '/black-mountain-3.jpg']
  }
  // Pranburi Khao Kalok
  if (id === 'c4ebd114-afc6-4d90-a3ed-0771c9a88dca') {
    return ['/pranburi-1.jpg', '/pranburi-2.jpg']
  }
  // Soi 112 (both listings)
  if (locLower.includes('soi 112')) {
    return ['/soi112-1.jpg', '/soi112-2.jpg', '/soi112-3.jpg', '/soi112-4.jpg', '/soi112-5.jpg']
  }

  return []
}

const SAM_ROI_YOT_LISTING_ID = '5561f9fa-59a5-4ec1-ab6f-6b54cc200fbe'
const SAM_ROI_YOT_TITLE_DEED = 'Nor Sor Kru Ta Daeng'
export const FEATURED_HOMEPAGE_LISTING_ID = 'fbd0d273-fada-4f4f-8341-09d5237ec12d'
const FEATURED_SOI112_LISTING_IDS = new Set([
  FEATURED_HOMEPAGE_LISTING_ID,
  '074685e5-8bdf-43b7-b5ef-8ca4634b1b5b',
])

export function isFeaturedHomepageListing(id?: string | null): boolean {
  return (id || '').trim() === FEATURED_HOMEPAGE_LISTING_ID
}

export function resolveListingTitleDeed(listing: {
  id?: string | null
  title_deed?: string | null
}): string | null {
  const id = (listing.id || '').trim()
  if (id === SAM_ROI_YOT_LISTING_ID) return SAM_ROI_YOT_TITLE_DEED

  const raw = listing.title_deed
  if (raw == null || String(raw).trim() === '') return null
  return String(raw)
}

export function resolveListingPriceDisplay(listing: {
  id?: string | null
  price?: string | null
}): {
  main: string | null
  sub: string | null
  footnote: string | null
  raw: string | null
} {
  const raw = listing.price == null ? null : String(listing.price).trim()
  if (!raw) {
    return { main: null, sub: null, footnote: null, raw: null }
  }

  if ((listing.id || '').trim() === FEATURED_HOMEPAGE_LISTING_ID) {
    return {
      main: '฿10,350,000',
      sub: '฿2,300,000/Rai',
      footnote: 'Per Rai available on request at a different price',
      raw,
    }
  }

  return {
    main: raw,
    sub: null,
    footnote: null,
    raw,
  }
}

export function resolveListingPhotos(listing: {
  id?: string | null
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

export function normalizeListingCategory(category?: string | null): ListingCategory {
  const value = (category || '').trim()
  if (LISTING_CATEGORIES.includes(value as ListingCategory)) {
    return value as ListingCategory
  }
  return 'Land & Property'
}

const BOAT_PROPERTY_TYPES = new Set(['boat', 'boot', 'longtail', 'speedboat', 'yacht'])
const LAND_PROPERTY_TYPES = new Set(['land', 'house', 'villa', 'condo', 'apartment', 'commercial'])
const VEHICLE_PROPERTY_TYPES = new Set(['car', 'motorcycle', 'truck', 'vehicle'])
const BUSINESS_PROPERTY_TYPES = new Set(['business', 'commercial'])

function propertyTypeKey(propertyType?: string | null): string {
  return (propertyType || '').trim().toLowerCase()
}

/**
 * Category pills filter on `property_type` (category column is not available in DB).
 */
export function resolveListingCategory(listing: {
  category?: string | null
  property_type?: string | null
}): ListingCategory {
  const type = propertyTypeKey(listing.property_type)
  if (BOAT_PROPERTY_TYPES.has(type)) return 'Boat'
  if (VEHICLE_PROPERTY_TYPES.has(type)) return 'Vehicle'
  if (type === 'business') return 'Business'
  if (LAND_PROPERTY_TYPES.has(type)) return 'Land & Property'
  return 'Other'
}

function matchesCategoryPill(
  propertyType: string | null | undefined,
  filterCategory: string
): boolean {
  if (filterCategory === 'All') return true

  const type = propertyTypeKey(propertyType)

  if (filterCategory === 'Boat') {
    return BOAT_PROPERTY_TYPES.has(type)
  }
  if (filterCategory === 'Land & Property') {
    return LAND_PROPERTY_TYPES.has(type)
  }
  if (filterCategory === 'Vehicle') {
    return VEHICLE_PROPERTY_TYPES.has(type)
  }
  if (filterCategory === 'Business') {
    return BUSINESS_PROPERTY_TYPES.has(type)
  }
  if (filterCategory === 'Other') {
    return (
      !BOAT_PROPERTY_TYPES.has(type) &&
      !LAND_PROPERTY_TYPES.has(type) &&
      !VEHICLE_PROPERTY_TYPES.has(type) &&
      !BUSINESS_PROPERTY_TYPES.has(type)
    )
  }

  return true
}

export function matchesListingFilters<
  T extends {
    category?: string | null
    property_type?: string | null
    region?: string | null
    location?: string | null
    transaction_type?: string | null
  },
>(listing: T, filters: ListingFiltersState): boolean {
  const categoryOk = matchesCategoryPill(listing.property_type, filters.category)

  const typeOk =
    filters.propertyType === 'All' ||
    filters.category === 'Vehicle' ||
    filters.category === 'Boat' ||
    filters.category === 'Business' ||
    filters.category === 'Other' ||
    propertyTypeKey(listing.property_type) === filters.propertyType.toLowerCase()

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

  return categoryOk && typeOk && regionOk && transactionOk
}
