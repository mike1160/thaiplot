import { setRequestLocale } from 'next-intl/server'
import RegionLandingPage, { buildRegionMetadata } from '@/components/RegionLandingPage'
import { HIN_LEK_FAI_CONTENT } from '@/content/region-pages'
import { fetchRegionListings } from '@/lib/region-pages'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildRegionMetadata(params.locale, HIN_LEK_FAI_CONTENT)
}

export default async function HinLekFaiPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listings = await fetchRegionListings('hin-lek-fai')

  return (
    <RegionLandingPage
      locale={params.locale}
      content={HIN_LEK_FAI_CONTENT}
      listings={listings}
    />
  )
}
