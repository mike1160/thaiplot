import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
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
    namespace: 'infoPaperwork',
    path: '/info/paperwork-thailand',
  })
}

export default async function PaperworkThailandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoPaperwork')
  const tp = await getTranslations('partnerLinks')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.paperwork}
      sections={[
        section('overview'),
        section('reality'),
        section('blueChanote'),
        section('yellowBook'),
        section('pinkId'),
        section('drivingWhere'),
        section('drivingExam'),
        section('otherDocs'),
        section('checklist'),
      ]}
      bottomSlot={
        <div className="space-y-10">
          <RelatedGuides
            title={tp('relatedOnThaiPlot')}
            links={[
              { href: '/info/thim-app', label: tp('linkThim') },
              { href: '/info/thailand-digital-arrival-card', label: tp('linkTdac') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
              { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
            ]}
          />
          <PartnerLinks
            title={tp('furtherReadingTitle')}
            links={[
              {
                href: hhlUrl(HHL_PATHS.foreignBuyers, params.locale),
                label: tp('foreignBuyers'),
              },
              {
                href: hhlUrl(HHL_PATHS.chanote, params.locale),
                label: tp('chanote'),
              },
              {
                href: hhlUrl(HHL_PATHS.europeanRetirees, params.locale),
                label: tp('europeanRetirees'),
              },
              {
                href: hhlUrl(HHL_PATHS.dutch, params.locale),
                label: tp('dutch'),
              },
            ]}
          />
        </div>
      }
    />
  )
}
