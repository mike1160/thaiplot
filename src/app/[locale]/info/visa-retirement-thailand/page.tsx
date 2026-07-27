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
    namespace: 'infoVisa',
    path: '/info/visa-retirement-thailand',
  })
}

export default async function VisaRetirementPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoVisa')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      sections={[
        section('oa'),
        section('elite'),
        section('ltr'),
        section('finance'),
        section('insurance'),
      ]}
    />
  )
}
