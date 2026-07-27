import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import ListingCard from '@/components/ListingCard'
import { Link } from '@/i18n/navigation'
import {
  listingPhotosForListing,
  listingPhotosFromColumns,
} from '@/lib/listing-ui'
import { getListing, listingPublicPath } from '@/lib/listings'
import { absoluteAssetUrl, localizedPath, SITE_URL } from '@/lib/seo'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

type Props = {
  params: { locale: string; id: string }
}

function listingOgImage(listing: {
  id?: string | null
  location?: string | null
  size?: string | null
  price?: string | null
  photo_1?: string | null
  photo_2?: string | null
  photo_3?: string | null
  photo_4?: string | null
  photo_5?: string | null
}): string {
  const uploaded = listingPhotosFromColumns(listing)
  if (uploaded[0]) return absoluteAssetUrl(uploaded[0])

  // Thanathip / seeded listings: use mapped gallery photo before generic hero
  const mapped = listingPhotosForListing(listing)
  if (mapped[0]) return absoluteAssetUrl(mapped[0])

  return absoluteAssetUrl('/hero.jpg')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing(params.id)
  if (!listing) {
    return {
      title: 'Listing | ThaiPlot',
      robots: { index: false, follow: false },
    }
  }

  const location = listing.location || 'Thailand'
  const size = listing.size || ''
  const titleCore = size ? `${location} — ${size}` : location
  const title = `${titleCore} | ThaiPlot`
  const description =
    listing.description?.trim().slice(0, 155) ||
    `Land for sale in ${location}, Thailand.`
  const path = listingPublicPath(listing)
  const canonical = localizedPath(params.locale, path)
  const image = listingOgImage(listing)

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, path)
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: titleCore,
      description,
      images: [{ url: image }],
      url: canonical,
      siteName: 'ThaiPlot',
      locale: params.locale === 'zh' ? 'zh_CN' : params.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleCore,
      description,
      images: [image],
    },
  }
}

export default async function ListingDetailPage({ params }: Props) {
  setRequestLocale(params.locale)
  const listing = await getListing(params.id)
  if (!listing) notFound()

  const t = await getTranslations({ locale: params.locale, namespace: 'listings' })
  const location = listing.location || 'Thailand'

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />

      <section className="px-4 sm:px-6 pt-8 pb-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/listings"
            className="inline-flex text-sm font-medium text-[#C8973A] hover:underline mb-4"
          >
            ← {t('pageTitle')}
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#1A2744] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {location}
            {listing.size ? ` — ${listing.size}` : ''}
          </h1>
          <ListingCard listing={listing} />
        </div>
      </section>

      <DisclaimerFooter />
    </main>
  )
}
