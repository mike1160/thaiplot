import { getTranslations, setRequestLocale } from 'next-intl/server'
import TransportGuideClient from '@/components/TransportGuideClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoTransport',
    path: '/info/transport-thailand',
  })
}

export default async function TransportThailandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoTransport')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, '/info/transport-thailand')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/transport-thailand"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.transport}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.transport') },
        ]}
      />
      <TransportGuideClient
        relatedTitle={tp('relatedOnThaiPlot')}
        relatedLinks={[
          { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
          { href: '/info/living-thailand', label: tp('linkLiving') },
          { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
          { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          { href: '/info/food-thailand', label: tp('linkFood') },
        ]}
      />
    </>
  )
}
