import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { BANGKOK_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, BANGKOK_CONTENT)
}

export default async function BangkokRegionPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('bangkok')

  return (
    <RegionLandingPage locale={params.locale} content={BANGKOK_CONTENT} listings={listings} />
  )
}
