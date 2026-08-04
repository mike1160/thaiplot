import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import { FaqJsonLd } from '@/components/SeoJsonLd'
import ThaiDataCard, { TitleVerifyCta } from '@/components/ThaiDataCard'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import { HHL_PATHS, hhlUrl } from '@/lib/hua-hin-land'

type Props = { params: { locale: string } }

const CHANOTE_FAQS = [
  {
    question: 'What is a Chanote title deed in Thailand?',
    answer:
      'Chanote (Nor Sor 4 Jor) is the strongest form of land title in Thailand. Boundaries are precisely surveyed by the Land Department and ownership is clearly registered. It is the preferred title for most property purchases.',
  },
  {
    question: 'How do I verify a Chanote title deed?',
    answer:
      'Visit the local Land Office with the title deed number and plot details. Confirm the owner name, encumbrances, mortgages and exact plot boundaries. Never rely on a photo of a title alone.',
  },
  {
    question: 'Can a foreigner own land with a Chanote title?',
    answer:
      'Foreigners generally cannot own freehold land in Thailand regardless of title type. Chanote is the strongest title available, but ownership structures for foreigners involve leasehold or Thai company arrangements. Always consult an independent Thai lawyer.',
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
    namespace: 'infoChanote',
    path: '/info/chanote-title-deed',
  })
}

export default async function ChanotePage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoChanote')
  const tp = await getTranslations('partnerLinks')
  const pageUrl = localizedPath(params.locale, '/info/chanote-title-deed')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <>
      <FaqJsonLd faqs={CHANOTE_FAQS} pageUrl={pageUrl} />
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
    </>
  )
}
