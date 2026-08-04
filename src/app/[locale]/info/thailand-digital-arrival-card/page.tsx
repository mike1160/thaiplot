import { getTranslations, setRequestLocale } from 'next-intl/server'
import { TdacGuideClient } from '@/components/ImmigrationGuidesClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoTdac',
    path: '/info/thailand-digital-arrival-card',
    ogImage: '/th-pl-6.JPG',
  })
}

export default async function TdacPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoTdac')
  const tb = await getTranslations('breadcrumb')
  const faqs = (t.raw('faqs') as { q: string; a: string }[]).map((f) => ({
    question: f.q,
    answer: f.a,
  }))
  const pageUrl = localizedPath(params.locale, '/info/thailand-digital-arrival-card')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/thailand-digital-arrival-card"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image="/th-pl-6.JPG"
      />
      <FaqJsonLd faqs={faqs} pageUrl={pageUrl} />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.tdac') },
        ]}
      />
      <TdacGuideClient />
    </>
  )
}
