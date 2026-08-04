import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import { FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import { HHL_PATHS, hhlUrl } from '@/lib/hua-hin-land'

type Props = { params: { locale: string } }

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

const VISA_FAQS = [
  {
    question: 'What is the Thailand retirement visa?',
    answer:
      'The Thai retirement visa (Non-Immigrant O-A) is a long-stay visa for foreigners aged 50 or over who wish to retire in Thailand. It is typically granted for one year and can be renewed annually.',
  },
  {
    question: 'How much money do I need for a Thailand retirement visa?',
    answer:
      'You need either 800,000 Thai baht deposited in a Thai bank account, or a monthly income of at least 65,000 baht, or a combination of both. Requirements can change — always verify with the Thai Immigration Bureau.',
  },
  {
    question: 'Do I need health insurance for a Thailand retirement visa?',
    answer:
      'Yes. Health insurance is required for the Non-OA retirement visa with minimum coverage of 40,000 baht for outpatient and 400,000 baht for inpatient care. Insurance must be from an approved provider.',
  },
  {
    question: 'How do I do 90-day reporting in Thailand?',
    answer:
      'You must report your address to Thai Immigration every 90 days. This can be done in person at the local Immigration office, by post, or via the THIM app. Failure to report on time can result in a fine.',
  },
]

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
  const pageUrl = localizedPath(params.locale, '/info/visa-retirement-thailand')

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
    <>
      <FaqJsonLd faqs={VISA_FAQS} pageUrl={pageUrl} />
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
            <PartnerLinks
              title={tp('furtherReadingUpdates')}
              links={[
                {
                  href: 'https://thethaiger.com/hot-news/expats',
                  label: tp('thaigerVisaExpats'),
                },
                {
                  href: 'https://thethaiger.com/guides/thailand-still-expat-favourite-new-rules',
                  label: tp('thaigerVisaFavourite'),
                },
                {
                  href: 'https://thethaiger.com/travel/thailand-travel/what-expats-in-thailand-wish-they-knew-before-moving-here',
                  label: tp('thaigerVisaWish'),
                },
              ]}
            />
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
    </>
  )
}
