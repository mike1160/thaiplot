import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import { buildPageMetadata } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import { HHL_PATHS, hhlUrl } from '@/lib/hua-hin-land'

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
    namespace: 'infoHuaHin',
    path: '/info/hua-hin-property-market',
  })
}

export default async function HuaHinMarketPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoHuaHin')
  const tp = await getTranslations('partnerLinks')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.huaHinMarket}
      sections={[
        section('overview'),
        section('prices'),
        section('areas'),
        section('expats'),
        section('outlook'),
      ]}
      bottomSlot={
        <PartnerLinks
          title={tp('furtherReadingTitle')}
          links={[
            {
              href: hhlUrl(HHL_PATHS.homepage, params.locale),
              label: tp('homepage'),
            },
            {
              href: hhlUrl(HHL_PATHS.faq, params.locale),
              label: tp('faq'),
            },
          ]}
        />
      }
    />
  )
}
