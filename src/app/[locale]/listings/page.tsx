import { setRequestLocale } from 'next-intl/server'
import ListingsPageClient from '@/components/ListingsPageClient'
import { fetchApprovedListings } from '@/lib/listings'

type Props = {
  params: { locale: string }
  searchParams?: { region?: string }
}

export default async function ListingsPage({ params, searchParams }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchApprovedListings()
  const initialRegion = searchParams?.region || 'All'

  return <ListingsPageClient listings={listings} initialRegion={initialRegion} />
}
