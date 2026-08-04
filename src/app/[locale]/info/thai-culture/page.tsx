import { getTranslations, setRequestLocale } from 'next-intl/server'
import CultureGuideClient from '@/components/CultureGuideClient'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

const PATH = '/info/thai-culture'
const OG =
  'https://images.pexels.com/photos/1031458/pexels-photo-1031458.jpeg?auto=compress&cs=tinysrgb&w=1200'

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoCulture',
    path: PATH,
    ogImage: OG,
  })
}

export default async function ThaiCulturePage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoCulture')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, PATH)

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path={PATH}
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.culture}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.culture') },
        ]}
      />
      <CultureGuideClient
        relatedTitle={tp('relatedOnThaiPlot')}
        relatedLinks={[
          { href: '/info/food-thailand', label: tp('linkFood') },
          { href: '/info/living-thailand', label: tp('linkLiving') },
          { href: '/info/transport-thailand', label: tp('linkTransport') },
          { href: '/info/thai-islands', label: tp('linkIslands') },
          { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
        ]}
      />
    </>
  )
}
