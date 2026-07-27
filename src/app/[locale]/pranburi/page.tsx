import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { PRANBURI_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, PRANBURI_CONTENT)
}

export default async function PranburiRegionPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('pranburi')

  return (
    <RegionLandingPage locale={params.locale} content={PRANBURI_CONTENT} listings={listings} />
  )
}
