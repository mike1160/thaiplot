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

  const section = (
    key: string,
    visual?: { image: string; altKey: string; captionKey: string }
  ) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
    ...(visual
      ? {
          image: visual.image,
          imageAlt: t(visual.altKey),
          imageCaption: t(visual.captionKey),
        }
      : {}),
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.paperwork}
      sections={[
        section('overview', {
          image: '/paperwork/paperwork-chanote.png',
          altKey: 'visuals.chanoteBookAlt',
          captionKey: 'visuals.chanoteBookCaption',
        }),
        section('reality'),
        section('blueChanote', {
          image: '/paperwork/paperwork-blue-deed.png',
          altKey: 'visuals.blueChanoteAlt',
          captionKey: 'visuals.blueChanoteCaption',
        }),
        section('yellowBook', {
          image: '/paperwork/paperwork-yellow-book.png',
          altKey: 'visuals.yellowBookAlt',
          captionKey: 'visuals.yellowBookCaption',
        }),
        section('pinkId', {
          image: '/paperwork/paperwork-pink-id.png',
          altKey: 'visuals.pinkIdAlt',
          captionKey: 'visuals.pinkIdCaption',
        }),
        section('drivingWhere', {
          image: '/paperwork/paperwork-driving-licence.png',
          altKey: 'visuals.drivingAlt',
          captionKey: 'visuals.drivingCaption',
        }),
        section('drivingExam'),
        section('otherDocs'),
        section('checklist'),
      ]}
      bottomSlot={
        <div className="space-y-10">
          <RelatedGuides
            title={tp('relatedOnThaiPlot')}
            links={[
              { href: '/info/buying-land-thailand', label: tp('linkBuying') },
              { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
              { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
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
