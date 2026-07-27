import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { PHUKET_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, PHUKET_CONTENT)
}

export default async function PhuketRegionPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('phuket')

  return (
    <RegionLandingPage locale={params.locale} content={PHUKET_CONTENT} listings={listings} />
  )
}
