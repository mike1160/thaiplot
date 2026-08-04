import { getTranslations, setRequestLocale } from 'next-intl/server'
import IslandsGuideClient from '@/components/IslandsGuideClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath, SITE_URL } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

const PATH = '/info/thai-islands'
const OG =
  'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1200'

export async function generateMetadata({ params }: Props) {
  const meta = await buildPageMetadata({
    locale: params.locale,
    namespace: 'infoIslands',
    path: PATH,
    ogImage: OG,
  })

  // Dutch alias URL for SEO (rewrite serves this page)
  if (params.locale === 'nl') {
    const canonical = `${SITE_URL}/nl/info/thaise-eilanden`
    return {
      ...meta,
      alternates: {
        ...meta.alternates,
        canonical,
      },
      openGraph: meta.openGraph
        ? { ...meta.openGraph, url: canonical }
        : undefined,
    }
  }

  return meta
}

export default async function ThaiIslandsPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoIslands')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl =
    params.locale === 'nl'
      ? `${SITE_URL}/nl/info/thaise-eilanden`
      : localizedPath(params.locale, PATH)

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path={PATH}
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.islands}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.islands') },
        ]}
      />
      <IslandsGuideClient
        relatedTitle={tp('relatedOnThaiPlot')}
        relatedLinks={[
          { href: '/info/transport-thailand', label: tp('linkTransport') },
          { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
          { href: '/info/food-thailand', label: tp('linkFood') },
          { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          { href: '/info/living-thailand', label: tp('linkLiving') },
        ]}
      />
    </>
  )
}
