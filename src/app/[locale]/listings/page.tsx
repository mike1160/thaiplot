import { setRequestLocale } from 'next-intl/server'
import ListingsPageClient from '@/components/ListingsPageClient'
import { fetchApprovedListings } from '@/lib/listings'

type Props = {
  params: { locale: string }
  searchParams?: {
    region?: string
    type?: string
    category?: string
    transaction?: string
  }
}

export default async function ListingsPage({ params, searchParams }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchApprovedListings()

  return (
    <ListingsPageClient
      listings={listings}
      initialRegion={searchParams?.region || 'All'}
      initialPropertyType={searchParams?.type || 'All'}
      initialCategory={searchParams?.category || 'All'}
      initialTransaction={searchParams?.transaction || 'For Sale'}
    />
  )
}
