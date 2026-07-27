import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import { buildPageMetadata } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

function SectionBody({ paras }: { paras: string[] }) {
  return (
    <>
      {paras.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoBuying',
    path: '/info/buying-land-thailand',
  })
}

export default async function BuyingLandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoBuying')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.buyingGuide}
      sections={[
        section('foreigners'),
        section('leasehold'),
        section('company'),
        section('titles'),
        section('dueDiligence'),
        section('costs'),
        section('faq'),
      ]}
    />
  )
}
