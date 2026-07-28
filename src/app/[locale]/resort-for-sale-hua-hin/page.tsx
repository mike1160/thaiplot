import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { RESORT_HUA_HIN_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, RESORT_HUA_HIN_CONTENT)
}

export default async function ResortHuaHinPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('resort-hua-hin')

  return (
    <RegionLandingPage
      locale={params.locale}
      content={RESORT_HUA_HIN_CONTENT}
      listings={listings}
    />
  )
}
