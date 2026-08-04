import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
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

/** Parse existing "Q: … A: …" FAQ paragraphs into schema items (no new copy). */
function faqsFromQaParas(paras: string[]): { question: string; answer: string }[] {
  return paras
    .map((p) => {
      const match = p.match(/^Q:\s*(.*?)\s*A:\s*([\s\S]*)$/)
      if (!match) return null
      return { question: match[1].trim(), answer: match[2].trim() }
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item))
}

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoBuying',
    path: '/info/buying-land-thailand',
    ogImage: HERO_PHOTOS.buyingGuide,
  })
}

export default async function BuyingLandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoBuying')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqParas = t.raw('faq.paras') as string[]
  const faqs = faqsFromQaParas(faqParas)
  const pageUrl = localizedPath(params.locale, '/info/buying-land-thailand')

  const section = (key: string) => ({
    title: t(`${key}.title`),
    body: <SectionBody paras={t.raw(`${key}.paras`) as string[]} />,
  })

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/buying-land-thailand"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.buyingGuide}
      />
      <FaqJsonLd faqs={faqs} pageUrl={pageUrl} />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.buyingLand') },
        ]}
      />
      <InfoPageShell
        title={t('title')}
        subtitle={t('subtitle')}
        heroImage={HERO_PHOTOS.buyingGuide}
        sections={[
          section('foreigners'),
          section('leasehold'),
          section('company'),
          section('titles'),
          section('dueDiligence'),
          section('costs'),
          section('livingAfter'),
          section('faq'),
        ]}
        bottomSlot={
          <div className="space-y-10">
            <RelatedGuides
              title={tp('relatedOnThaiPlot')}
              links={[
                { href: '/info/chanote-title-deed', label: tp('chanote') },
                { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
                { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
                { href: '/info/living-thailand', label: tp('linkLiving') },
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
                  href: 'https://thethaiger.com/thai-life/property',
                  label: tp('thaigerProperty'),
                },
              ]}
            />
          </div>
        }
      />
    </>
  )
}
