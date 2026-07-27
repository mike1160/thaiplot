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

  return <HomePageClient listings={listings} />
}
