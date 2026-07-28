import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { VILLAS_HUA_HIN_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, VILLAS_HUA_HIN_CONTENT)
}

export default async function VillasHuaHinPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('villas-hua-hin')

  return (
    <RegionLandingPage
      locale={params.locale}
      content={VILLAS_HUA_HIN_CONTENT}
      listings={listings}
    />
  )
}
