import { setRequestLocale } from 'next-intl/server'
import HomePageClient from '@/components/HomePageClient'
import { fetchApprovedListings } from '@/lib/listings'

export const dynamic = 'force-dynamic'

type Props = {
  params: { locale: string }
}

export default async function HomePage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchApprovedListings()
  console.log('[HomePage] listings fetched', {
    count: listings.length,
    ids: listings.map((l) => l.id),
    titles: listings.map((l) => ({ id: l.id, title_deed: l.title_deed, location: l.location })),
  })

  return <HomePageClient listings={listings} />
}
