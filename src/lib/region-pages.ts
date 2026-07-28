import type { PublicListing } from '@/lib/listings'
import { fetchApprovedListings } from '@/lib/listings'

export type RegionPageId =
  | 'hua-hin'
  | 'pranburi'
  | 'black-mountain'
  | 'phuket'
  | 'bangkok'
  | 'hin-lek-fai'
  | 'villas-hua-hin'
  | 'resort-hua-hin'
  | 'koh-samui'

function textBlob(listing: PublicListing): string {
  return [listing.location, listing.description, listing.region, listing.title_deed]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function propertyTypeKey(listing: PublicListing): string {
  return (listing.property_type || '').trim().toLowerCase()
}

/** Parse approximate rai from free-text size fields like "4 Rai 2 Ngan" or "2 Rai (3,200 m²)". */
export function parseSizeRai(size: string | null | undefined): number {
  if (!size) return 0
  const match = size.match(/(\d+(?:[.,]\d+)?)\s*rai/i)
  if (!match) return 0
  return Number.parseFloat(match[1].replace(',', '.')) || 0
}

function sortByNeedleFirst(listings: PublicListing[], needle: string): PublicListing[] {
  const n = needle.toLowerCase()
  return [...listings].sort((a, b) => {
    const aScore = textBlob(a).includes(n) ? 0 : 1
    const bScore = textBlob(b).includes(n) ? 0 : 1
    return aScore - bScore
  })
}

/** Fetch approved listings filtered for a region / niche landing page. */
export async function fetchRegionListings(page: RegionPageId): Promise<PublicListing[]> {
  if (page === 'hua-hin') {
    return fetchApprovedListings({ region: 'Hua Hin', limit: 50 })
  }
  if (page === 'pranburi') {
    return fetchApprovedListings({ region: 'Pranburi', limit: 50 })
  }
  if (page === 'phuket') {
    return fetchApprovedListings({ region: 'Phuket', limit: 50 })
  }
  if (page === 'bangkok') {
    return fetchApprovedListings({ region: 'Bangkok', limit: 50 })
  }
  if (page === 'koh-samui') {
    return fetchApprovedListings({ region: 'Koh Samui', limit: 50 })
  }

  if (page === 'hin-lek-fai') {
    // location contains "Hin Lek Fai" OR region = "Hua Hin" (HLF matches first)
    const huaHin = await fetchApprovedListings({ region: 'Hua Hin', limit: 100 })
    return sortByNeedleFirst(huaHin, 'hin lek fai')
  }

  if (page === 'villas-hua-hin') {
    // Villa OR House OR region Hua Hin — villa/house first
    const all = await fetchApprovedListings({ limit: 100 })
    const filtered = all.filter((listing) => {
      const type = propertyTypeKey(listing)
      const isVillaOrHouse = type === 'villa' || type === 'house'
      const isHuaHin = (listing.region || '').toLowerCase() === 'hua hin'
      return isVillaOrHouse || isHuaHin
    })
    return [...filtered].sort((a, b) => {
      const aType = propertyTypeKey(a)
      const bType = propertyTypeKey(b)
      const aScore = aType === 'villa' || aType === 'house' ? 0 : 1
      const bScore = bType === 'villa' || bType === 'house' ? 0 : 1
      return aScore - bScore
    })
  }

  if (page === 'resort-hua-hin') {
    // size_rai >= 3 OR type = Commercial
    const all = await fetchApprovedListings({ limit: 100 })
    return all.filter((listing) => {
      const type = propertyTypeKey(listing)
      return parseSizeRai(listing.size) >= 3 || type === 'commercial'
    })
  }

  // black-mountain default
  const huaHin = await fetchApprovedListings({ region: 'Hua Hin', limit: 100 })
  return sortByNeedleFirst(huaHin, 'black mountain')
}
