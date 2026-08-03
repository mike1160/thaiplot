import { setRequestLocale } from 'next-intl/server'
import OfficialDownloadsClient from '@/components/OfficialDownloadsClient'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoOfficialDownloads',
    path: '/info/official-thai-downloads',
  })
}

export default function OfficialThaiDownloadsPage({ params }: Props) {
  setRequestLocale(params.locale)
  return <OfficialDownloadsClient />
}
