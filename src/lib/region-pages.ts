import type { PublicListing } from '@/lib/listings'
import { fetchApprovedListings } from '@/lib/listings'

export type RegionPageId =
  | 'hua-hin'
  | 'pranburi'
  | 'black-mountain'
  | 'phuket'
  | 'bangkok'

function textBlob(listing: PublicListing): string {
  return [listing.location, listing.description, listing.region, listing.title_deed]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/** Fetch approved listings filtered for a region landing page. */
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

  // title/location contains "Black Mountain" OR region = "Hua Hin" (BM matches first)
  const huaHin = await fetchApprovedListings({ region: 'Hua Hin', limit: 100 })
  return [...huaHin].sort((a, b) => {
    const aScore = textBlob(a).includes('black mountain') ? 0 : 1
    const bScore = textBlob(b).includes('black mountain') ? 0 : 1
    return aScore - bScore
  })
}
