'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import ListingCard from '@/components/ListingCard'
import SearchFilterBar from '@/components/SearchFilterBar'
import type { PublicListing } from '@/lib/listings'
import {
  DEFAULT_FILTERS,
  matchesListingFilters,
  type ListingFiltersState,
} from '@/lib/listing-ui'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = {
  listings: PublicListing[]
  initialRegion?: string
  initialPropertyType?: string
  initialCategory?: string
  initialTransaction?: string
}

export default function ListingsPageClient({
  listings,
  initialRegion = 'All',
  initialPropertyType = 'All',
  initialCategory = 'All',
  initialTransaction = 'For Sale',
}: Props) {
  const t = useTranslations('listings')
  const tn = useTranslations('navigation')

  const initial: ListingFiltersState = {
    ...DEFAULT_FILTERS,
    region: initialRegion && initialRegion !== 'All' ? initialRegion : 'All',
    propertyType:
      initialPropertyType && initialPropertyType !== 'All' ? initialPropertyType : 'All',
    category: initialCategory && initialCategory !== 'All' ? initialCategory : 'All',
    transaction: initialTransaction || 'For Sale',
  }

  const [filters, setFilters] = useState<ListingFiltersState>(initial)
  const [applied, setApplied] = useState<ListingFiltersState>(initial)

  const filtered = useMemo(
    () => listings.filter((item) => matchesListingFilters(item, applied)),
    [listings, applied]
  )

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />

      <InfoHero
        eyebrow={t('heroEyebrow')}
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        image={HERO_PHOTOS.listings}
        size="main"
      />

      <section className="px-4 sm:px-6 -mt-8 relative z-10 mb-4">
        <div className="max-w-5xl mx-auto">
          <SearchFilterBar
            value={filters}
            onChange={setFilters}
            onSearch={(next) => setApplied(next ?? filters)}
          />
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#E8E2D6] rounded-[12px] p-8 md:p-12 text-center">
              <p className="text-[#5C5247] text-sm md:text-base mb-6">{t('empty')}</p>
              <Link
                href="/list-property"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-colors"
              >
                {tn('listProperty')}
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
        <DisclaimerFooter />
      </div>
    </main>
  )
}
