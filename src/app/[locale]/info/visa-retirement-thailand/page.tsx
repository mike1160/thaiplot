import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import { buildPageMetadata } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import { HHL_PATHS, hhlUrl } from '@/lib/hua-hin-land'

type Props = { params: { locale: string } }

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

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
    ogImage: PEXELS('4922356/pexels-photo-4922356.jpeg', 1200),
  })
}

export default async function VisaRetirementPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoVisa')
  const tp = await getTranslations('partnerLinks')

  const section = (
    key: string,
    photo?: { src: string; alt: string }
  ) => ({
    title: t(`${key}.title`),
    image: photo?.src,
    imageAlt: photo?.alt,
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <InfoPageShell
      title={t('title')}
      subtitle={t('subtitle')}
      heroImage={HERO_PHOTOS.visa}
      heroImageAlt="Open passport with travel stamps — Thailand retirement visa"
      sections={[
        section('oa', {
          src: PEXELS('5405598/pexels-photo-5405598.jpeg'),
          alt: 'Travel documents and passport for Thailand visa application',
        }),
        section('elite'),
        section('ltr'),
        section('finance', {
          src: PEXELS('7235900/pexels-photo-7235900.jpeg'),
          alt: 'Passport and compass on world map — planning Thailand retirement',
        }),
        section('bankingLiving', {
          src: PEXELS('4922086/pexels-photo-4922086.jpeg'),
          alt: 'Hand holding passport with stamps — Thailand 90-day reporting',
        }),
        section('insurance', {
          src: PEXELS('1571460/pexels-photo-1571460.jpeg'),
          alt: 'Comfortable living room — expat life in Thailand',
        }),
      ]}
      bottomSlot={
        <div className="space-y-10">
          <RelatedGuides
            title={tp('relatedOnThaiPlot')}
            links={[
              { href: '/info/thim-app', label: tp('linkThim') },
              { href: '/info/thailand-digital-arrival-card', label: tp('linkTdac') },
              { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
              { href: '/info/living-thailand', label: tp('linkLiving') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
              { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
            ]}
          />
          <PartnerLinks
            title={tp('furtherReadingTitle')}
            links={[
              {
                href: hhlUrl(HHL_PATHS.europeanRetirees, params.locale),
                label: tp('europeanRetirees'),
              },
              {
                href: hhlUrl(HHL_PATHS.usaRetirees, params.locale),
                label: tp('usaRetirees'),
              },
              {
                href: hhlUrl(HHL_PATHS.dutch, params.locale),
                label: tp('dutch'),
              },
              {
                href: hhlUrl(HHL_PATHS.scandinavians, params.locale),
                label: tp('scandinavians'),
              },
              {
                href: hhlUrl(HHL_PATHS.foreignBuyers, params.locale),
                label: tp('foreignBuyers'),
              },
            ]}
          />
        </div>
      }
    />
  )
}
