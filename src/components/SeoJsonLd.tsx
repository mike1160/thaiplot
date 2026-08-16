import { SITE_URL, localizedPath } from '@/lib/seo'
import { listingPublicPath } from '@/lib/listings'

type FaqItem = { question: string; answer: string }

export function ArticleJsonLd({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string
  path: string
  title: string
  description: string
  image?: string
}) {
  const url = localizedPath(locale, path)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'ThaiPlot', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'ThaiPlot',
      url: SITE_URL,
    },
    inLanguage: locale,
    ...(image
      ? {
          image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FaqJsonLd({ faqs, pageUrl }: { faqs: FaqItem[]; pageUrl: string }) {
  if (faqs.length === 0) return null
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

export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string
  items: { name: string; path?: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: localizedPath(locale, item.path) }
        : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SoftwareAppJsonLd({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'THB',
    },
    author: {
      '@type': 'Organization',
      name: 'Immigration Bureau of Thailand',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Thaiplot',
    url: SITE_URL,
    description: 'Thai land and property listings with Chanote title deeds',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function schemaPrice(price: string | null | undefined): string | undefined {
  if (!price) return undefined
  const digits = String(price).replace(/[^\d.]/g, '')
  return digits || undefined
}

export function RealEstateListingJsonLd({
  locale,
  listing,
}: {
  locale: string
  listing: {
    id: string
    slug?: string | null
    location?: string | null
    description?: string | null
    price?: string | null
    region?: string | null
  }
}) {
  const path = listingPublicPath(listing)
  const price = schemaPrice(listing.price)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.location || 'Thailand',
    description: listing.description || undefined,
    url: localizedPath(locale, path),
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'THB',
          },
        }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.region || listing.location || 'Thailand',
      addressCountry: 'TH',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
