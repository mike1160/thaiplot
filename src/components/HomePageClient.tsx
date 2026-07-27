'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import HomeNavbar from '@/components/HomeNavbar'
import ListingCard from '@/components/ListingCard'
import LineButton from '@/components/LineButton'
import SearchFilterBar from '@/components/SearchFilterBar'
import SiteFooter from '@/components/SiteFooter'
import { TitleVerifyCta } from '@/components/ThaiDataCard'
import { AGENT_NAME, AGENT_PHONE_DISPLAY } from '@/lib/contact'
import type { PublicListing } from '@/lib/listings'
import {
  DEFAULT_FILTERS,
  matchesListingFilters,
  type ListingFiltersState,
} from '@/lib/listing-ui'

type Props = {
  listings: PublicListing[]
}

function listingsHref(filters: ListingFiltersState): string {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'All') {
    params.set('category', filters.category)
  }
  if (filters.propertyType && filters.propertyType !== 'All') {
    params.set('type', filters.propertyType)
  }
  if (filters.region && filters.region !== 'All') {
    params.set('region', filters.region)
  }
  if (filters.transaction && filters.transaction !== 'For Sale') {
    params.set('transaction', filters.transaction)
  }
  const query = params.toString()
  return query ? `/listings?${query}` : '/listings'
}

export default function HomePageClient({ listings }: Props) {
  const t = useTranslations('homepage')
  const router = useRouter()
  const [filters, setFilters] = useState<ListingFiltersState>(DEFAULT_FILTERS)

  const preview = useMemo(
    () => listings.filter((item) => matchesListingFilters(item, filters)).slice(0, 6),
    [listings, filters]
  )

  function goToListings(next?: ListingFiltersState) {
    const target = next ?? filters
    setFilters(target)
    router.push(listingsHref(target))
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <HomeNavbar />

      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center text-white animate-fade-in-up">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs md:text-sm font-medium bg-white/15 border border-white/25 backdrop-blur-sm mb-6">
            {t('eyebrow')}
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-5"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-[12px] text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ background: '#C8973A' }}
            >
              {t('ctaBrowse')}
            </Link>
            <Link
              href="/list-property"
              className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-[12px] text-sm font-semibold bg-white text-[#1A2744] border border-white hover:bg-[#FAF7F0] transition-colors"
            >
              {t('ctaList')}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <SearchFilterBar
            value={filters}
            onChange={setFilters}
            onSearch={(next) => goToListings(next)}
          />
        </div>
      </section>

      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-10"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('featuredTitle')}
          </h2>

          {preview.length === 0 ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-10 text-center">
              <p className="text-[#5C5247] mb-5">{t('featuredEmpty')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-[12px] text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
                >
                  {t('viewAllListings')}
                </Link>
                <Link
                  href="/list-property"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-[12px] text-sm font-semibold border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                >
                  {t('ctaList')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3 animate-stagger">
                {preview.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-[12px] text-sm font-semibold border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
                >
                  {t('viewAllListings')}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section
        id="saved-souls"
        className="w-full border-t-2 border-b-2 border-[#C8973A] bg-[#FAF7F0] py-14 md:py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="order-1">
            <div className="relative overflow-hidden rounded-[12px] shadow-[0_12px_40px_rgba(26,39,68,0.18)]">
              <img
                src="/dog-wheelchair-small.webp"
                alt={t('donateSectionTitle')}
                className="w-full h-auto min-h-[280px] md:min-h-[420px] max-h-[520px] object-cover object-center"
              />
            </div>
          </div>
          <div className="order-2 text-center md:text-left">
            <p className="text-[#C8973A] text-sm md:text-base font-semibold tracking-wide mb-3">
              {t('donateSectionEyebrow')}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A2744] mb-5 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('donateSectionTitle')}
            </h2>
            <p className="text-[#5C5247] text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line max-w-xl md:max-w-none mx-auto md:mx-0">
              {t('donateSectionBody')}
            </p>
            <a
              href="https://www.savedsouls-foundation.org/en/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-[12px] text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-[0_8px_24px_rgba(217,119,6,0.35)]"
            >
              {t('donateSectionCta')}
            </a>
            <p className="mt-4 text-sm text-[#5C5247]">{t('donateSectionNote')}</p>
          </div>
        </div>
      </section>

      <section className="pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('agentTitle')}
          </h2>
          <div className="border border-[#C8973A]/40 bg-[#FAF7F0] rounded-[12px] p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-20 h-20 rounded-full bg-[#E8E2D6] flex items-center justify-center flex-shrink-0">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="4" stroke="#1A2744" strokeWidth="1.5" />
                <path
                  d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"
                  stroke="#1A2744"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3
                className="text-2xl font-bold text-[#1A2744] mb-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {AGENT_NAME}
              </h3>
              <p className="text-[#5C5247] text-sm mb-3">{t('agentRole')}</p>
              <a
                href={`tel:${AGENT_PHONE_DISPLAY.replace(/-/g, '')}`}
                className="inline-block text-[#1A2744] font-semibold mb-4 hover:text-[#C8973A] transition-colors"
              >
                {AGENT_PHONE_DISPLAY}
              </a>
              <div>
                <LineButton size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="max-w-5xl mx-auto bg-[#1A2744] rounded-[12px] px-6 py-10 md:py-12 text-center text-white">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('ctaBarTitle')}
          </h2>
          <Link
            href="/list-property"
            className="inline-flex items-center justify-center min-h-[48px] px-7 rounded-[12px] text-sm font-semibold text-white mb-4 transition-all hover:brightness-110"
            style={{ background: '#C8973A' }}
          >
            {t('ctaBarButton')}
          </Link>
          <p className="text-white/65 text-sm">{t('ctaBarNote')}</p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <TitleVerifyCta />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
