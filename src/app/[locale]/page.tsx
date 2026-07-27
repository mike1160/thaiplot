import { unstable_noStore as noStore } from 'next/cache'
import { setRequestLocale } from 'next-intl/server'
import HomePageClient from '@/components/HomePageClient'
import { fetchApprovedListings } from '@/lib/listings'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

type Props = {
  params: { locale: string }
}

export default async function HomePage({ params }: Props) {
  noStore()
  setRequestLocale(params.locale)
  // Featured first, then Thanathip (created_at ASC), then new listings — max 50
  const listings = await fetchApprovedListings({ limit: 50 })
  console.log('[HomePage] listings fetched', {
    count: listings.length,
    ids: listings.map((l) => l.id),
    titles: listings.map((l) => ({ id: l.id, title_deed: l.title_deed, location: l.location })),
  })

  return <HomePageClient listings={listings} />
}
