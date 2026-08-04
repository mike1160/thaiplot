import { getTranslations, setRequestLocale } from 'next-intl/server'
import LivingGuideClient from '@/components/LivingGuideClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoLiving',
    path: '/info/living-thailand',
    ogImage:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  })
}

export default async function LivingThailandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoLiving')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, '/info/living-thailand')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/living-thailand"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.living}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.living') },
        ]}
      />
      <LivingGuideClient
        relatedTitle={tp('relatedOnThaiPlot')}
        relatedLinks={[
          { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
          { href: '/info/thai-culture', label: tp('linkCulture') },
          { href: '/info/transport-thailand', label: tp('linkTransport') },
          { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
          { href: '/info/buying-land-thailand', label: tp('linkBuying') },
        ]}
        furtherReadingTitle={tp('furtherReadingUpdates')}
        furtherReadingLinks={[
          {
            href: 'https://thethaiger.com/guides/best-of/lifestyle/expat-living-in-thailand-lifestyle-realities',
            label: tp('thaigerLivingRealities'),
          },
          {
            href: 'https://thethaiger.com/thai-life/everything-to-know-about-living-in-thailand-as-an-expat',
            label: tp('thaigerLivingEverything'),
          },
          {
            href: 'https://thethaiger.com/travel/thailand-travel/has-thailand-lost-its-edge-comparing-expat-life-across-southeast-asia',
            label: tp('thaigerLivingEdge'),
          },
        ]}
      />
    </>
  )
}
