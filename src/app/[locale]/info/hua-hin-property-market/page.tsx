import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import { buildPageMetadata } from '@/lib/seo'

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

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      sections={[
        section('overview'),
        section('prices'),
        section('areas'),
        section('expats'),
        section('outlook'),
      ]}
    />
  )
}
