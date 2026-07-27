import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { HUA_HIN_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, HUA_HIN_CONTENT)
}

export default async function HuaHinRegionPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('hua-hin')

  return (
    <RegionLandingPage locale={params.locale} content={HUA_HIN_CONTENT} listings={listings} />
  )
}
