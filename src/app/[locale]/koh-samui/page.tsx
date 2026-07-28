import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { KOH_SAMUI_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, KOH_SAMUI_CONTENT)
}

export default async function KohSamuiPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('koh-samui')

  return (
    <RegionLandingPage locale={params.locale} content={KOH_SAMUI_CONTENT} listings={listings} />
  )
}
