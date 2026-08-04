import { setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import SiteFooter from '@/components/SiteFooter'
import ThailandNewsWidget from '@/components/ThailandNewsWidget'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'newsPage',
    path: '/news',
  })
}

export default function NewsPage({ params }: Props) {
  setRequestLocale(params.locale)

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8973A]">
          Latest updates
        </p>
        <h1
          className="mb-3 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Thailand News
        </h1>
        <p className="mb-10 text-[#5C5247] leading-relaxed">
          Current news on property, expat life, visas and living in Thailand — sourced from
          international English-language news publishers. ThaiPlot curates these headlines;
          articles open on their original source.
        </p>

        <ThailandNewsWidget limit={20} showImages showMoreLink={false} />

        <p className="mt-10 text-xs leading-relaxed text-[#5C5247]/80">
          News sourced via Currents API from international publishers. ThaiPlot is not responsible
          for third-party content. Updated every 30 minutes.
        </p>

        <div className="mt-10 border-t border-[#E8E2D6]/90 pt-6">
          <DisclaimerFooter />
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
