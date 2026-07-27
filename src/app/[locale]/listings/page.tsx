import { setRequestLocale } from 'next-intl/server'
import ListingsPageClient from '@/components/ListingsPageClient'
import { fetchApprovedListings } from '@/lib/listings'

export const dynamic = 'force-dynamic'

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
  const listings = await fetchApprovedListings({ limit: 50 })

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
