import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import ThaiDataCard, { TitleVerifyCta } from '@/components/ThaiDataCard'
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
    namespace: 'infoChanote',
    path: '/info/chanote-title-deed',
  })
}

export default async function ChanotePage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoChanote')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      sections={[
        section('what'),
        section('safest'),
        section('verify'),
        section('garuda'),
        section('compare'),
      ]}
      bottomSlot={
        <div className="space-y-6">
          <TitleVerifyCta />
          <ThaiDataCard />
        </div>
      }
    />
  )
}
