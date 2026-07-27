import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { BLACK_MOUNTAIN_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, BLACK_MOUNTAIN_CONTENT)
}

export default async function BlackMountainRegionPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('black-mountain')

  return (
    <RegionLandingPage
      locale={params.locale}
      content={BLACK_MOUNTAIN_CONTENT}
      listings={listings}
    />
  )
}
