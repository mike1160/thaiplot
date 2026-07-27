import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import ListingCard from '@/components/ListingCard'
import type { PublicListing } from '@/lib/listings'
import { absoluteAssetUrl, localizedPath } from '@/lib/seo'
import { routing } from '@/i18n/routing'

export type RegionArea = { heading: string; body: string }
export type RegionBullet = { title: string; body: string }
export type RegionFaq = { question: string; answer: string }
export type RegionLink = { href: string; label: string; external?: boolean }

export type RegionPageContent = {
  path: string
  metaTitle: string
  metaDescription: string
  title: string
  intro: string
  areasHeading?: string
  areas?: RegionArea[]
  whyHeading?: string
  bullets?: RegionBullet[]
  listingsHeading: string
  emptyText: string
  buyingHeading?: string
  buyingBody?: string
  buyingLinkHref?: string
  buyingLinkLabel?: string
  faqHeading: string
  faqs: RegionFaq[]
  links: RegionLink[]
}

type Props = {
  locale: string
  content: RegionPageContent
  listings: PublicListing[]
}

export function buildRegionMetadata(locale: string, content: RegionPageContent): Metadata {
  const canonical = localizedPath(locale, content.path)
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, content.path)
  }
  const ogImage = absoluteAssetUrl('/hero.jpg')

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical, languages },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      siteName: 'ThaiPlot',
      locale: locale === 'zh' ? 'zh_CN' : locale,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: content.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: [ogImage],
    },
  }
}

function FaqJsonLd({ faqs, pageUrl }: { faqs: RegionFaq[]; pageUrl: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    url: pageUrl,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl md:text-2xl font-bold text-[#1A2744] mb-4"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {children}
    </h2>
  )
}

export default function RegionLandingPage({ locale, content, listings }: Props) {
  const pageUrl = localizedPath(locale, content.path)

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <FaqJsonLd faqs={content.faqs} pageUrl={pageUrl} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        <header>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A2744] mb-5 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {content.title}
          </h1>
          <p className="text-[#5C5247] text-base md:text-lg leading-relaxed">{content.intro}</p>
        </header>

        {content.areas && content.areas.length > 0 ? (
          <section>
            <SectionHeading>{content.areasHeading || 'Popular areas'}</SectionHeading>
            <div className="space-y-6">
              {content.areas.map((area) => (
                <div key={area.heading}>
                  <h3
                    className="text-lg font-semibold text-[#1A2744] mb-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {area.heading}
                  </h3>
                  <p className="text-[#5C5247] text-sm md:text-base leading-relaxed">{area.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {content.bullets && content.bullets.length > 0 ? (
          <section>
            <SectionHeading>{content.whyHeading || 'Why buyers choose this area'}</SectionHeading>
            <ul className="space-y-4">
              {content.bullets.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C8973A] shrink-0" aria-hidden />
                  <div>
                    <p className="font-semibold text-[#1A2744] text-sm md:text-base">{item.title}</p>
                    <p className="text-[#5C5247] text-sm md:text-base leading-relaxed mt-1">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <section className="border-y border-[#E8E2D6] bg-[#FAF7F0] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1A2744] mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {content.listingsHeading}
          </h2>

          {listings.length === 0 ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-8 text-center">
              <p className="text-[#5C5247] text-sm md:text-base">{content.emptyText}</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {content.buyingBody ? (
          <section>
            <SectionHeading>{content.buyingHeading || 'Buying land as a foreigner'}</SectionHeading>
            <p className="text-[#5C5247] text-sm md:text-base leading-relaxed mb-3">
              {content.buyingBody}
            </p>
            {content.buyingLinkHref && content.buyingLinkLabel ? (
              <Link
                href={content.buyingLinkHref}
                className="text-sm font-semibold text-[#C8973A] hover:underline underline-offset-2"
              >
                {content.buyingLinkLabel}
              </Link>
            ) : null}
          </section>
        ) : null}

        <section>
          <SectionHeading>{content.faqHeading}</SectionHeading>
          <div className="space-y-5">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="border-b border-[#E8E2D6] pb-5 last:border-0">
                <h3 className="font-semibold text-[#1A2744] text-sm md:text-base mb-2">
                  {faq.question}
                </h3>
                <p className="text-[#5C5247] text-sm md:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Related pages" className="pt-2">
          <ul className="space-y-2.5">
            {content.links.map((link) => (
              <li key={link.href + link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#C8973A] hover:underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[#C8973A] hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-4 border-t border-[#E8E2D6]">
          <DisclaimerFooter />
        </div>
      </article>
    </main>
  )
}
