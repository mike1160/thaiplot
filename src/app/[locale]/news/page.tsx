import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import SiteFooter from '@/components/SiteFooter'
import ThaiNewsWidget from '@/components/ThaiNewsWidget'
import { buildPageMetadata, localizedPath, SITE_URL } from '@/lib/seo'

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
  const pageUrl = localizedPath(params.locale, '/news')

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'ThaiPlot News',
    url: pageUrl,
    description:
      'Daily Thailand news for expats and property buyers — Bangkok Post, The Thaiger and more.',
    parentOrganization: {
      '@type': 'Organization',
      name: 'ThaiPlot',
      url: SITE_URL,
    },
  }

  return (
    <main className="min-h-screen text-[#142038]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <BreadcrumbNav />
      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 320,
            display: 'flex',
            alignItems: 'flex-end',
            overflow: 'hidden',
            borderRadius: '0 0 16px 16px',
            marginBottom: 40,
          }}
        >
          <Image
            src="/news-hero.png"
            alt=""
            aria-hidden
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center 60%',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
            }}
            aria-hidden
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '40px 40px 36px',
              maxWidth: 700,
            }}
          >
            <p
              style={{
                color: '#00e676',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: '0 0 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  background: '#00c853',
                  color: '#003d1a',
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 10,
                }}
              >
                THAILAND NEWS
              </span>
              Dagelijks bijgewerkt
            </p>

            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 700,
                margin: '0 0 12px',
                lineHeight: 1.15,
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              Thailand News
            </h1>

            <p
              style={{
                color: 'rgba(255,255,255,0.88)',
                fontSize: 15,
                margin: 0,
                lineHeight: 1.6,
                textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                maxWidth: 520,
              }}
            >
              Dagelijkse headlines voor expats en vastgoedkopers — Bangkok Post, The Thaiger en
              r/Thailand. Artikelen openen op de originele bron.
            </p>
          </div>
        </div>

        <ThaiNewsWidget variant="page" />

        <p className="mt-8 text-xs leading-relaxed text-[#5C5247]/80">
          Headlines are loaded from public RSS feeds. ThaiPlot is not responsible for third-party
          content. Cached in your browser for 30 minutes.
        </p>

        <div className="mt-10 border-t border-[#E8E2D6]/90 pt-6">
          <DisclaimerFooter />
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
