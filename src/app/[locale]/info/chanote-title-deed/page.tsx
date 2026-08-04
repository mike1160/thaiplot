import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import ThaiDataCard, { TitleVerifyCta } from '@/components/ThaiDataCard'
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
    namespace: 'infoChanote',
    path: '/info/chanote-title-deed',
  })
}

export default async function ChanotePage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoChanote')
  const tp = await getTranslations('partnerLinks')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.chanote}
      sections={[
        section('what'),
        section('safest'),
        section('verify'),
        section('garuda'),
        section('compare'),
      ]}
      bottomSlot={
        <div className="space-y-6">
          <RelatedGuides
            title={tp('relatedOnThaiPlot')}
            links={[
              { href: '/info/buying-land-thailand', label: tp('linkBuying') },
              { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
            ]}
          />
          <PartnerLinks
            title={tp('furtherReadingTitle')}
            links={[
              {
                href: hhlUrl(HHL_PATHS.chanote, params.locale),
                label: tp('chanote'),
              },
              {
                href: hhlUrl(HHL_PATHS.foreignBuyers, params.locale),
                label: tp('foreignBuyers'),
              },
            ]}
          />
          <TitleVerifyCta />
          <ThaiDataCard />
        </div>
      }
    />
  )
}
