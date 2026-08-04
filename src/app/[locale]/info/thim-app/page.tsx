import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ThimGuideClient } from '@/components/ImmigrationGuidesClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd, SoftwareAppJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoThim',
    path: '/info/thim-app',
    ogImage: '/THIM-APP-2.png',
  })
}

export default async function ThimAppPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoThim')
  const tb = await getTranslations('breadcrumb')
  const faqs = (t.raw('faqs') as { q: string; a: string }[]).map((f) => ({
    question: f.q,
    answer: f.a,
  }))
  const pageUrl = localizedPath(params.locale, '/info/thim-app')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/thim-app"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image="/THIM-APP-2.png"
      />
      <FaqJsonLd faqs={faqs} pageUrl={pageUrl} />
      <SoftwareAppJsonLd
        name="THIM - Thai Immigration Management"
        description={t('metaDescription')}
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.guide'), path: '/info/buying-land-thailand' },
          { name: tb('pages.thimApp') },
        ]}
      />
      <ThimGuideClient />
    </>
  )
}
