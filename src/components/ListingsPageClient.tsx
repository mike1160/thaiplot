'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import ListingCard from '@/components/ListingCard'
import SearchFilterBar from '@/components/SearchFilterBar'
import type { PublicListing } from '@/lib/listings'
import {
  DEFAULT_FILTERS,
  matchesListingFilters,
  type ListingFiltersState,
} from '@/lib/listing-ui'

type Props = {
  listings: PublicListing[]
  initialRegion?: string
}

export default function ListingsPageClient({ listings, initialRegion = 'All' }: Props) {
  const t = useTranslations('listings')
  const tn = useTranslations('navigation')

  const initial: ListingFiltersState = {
    ...DEFAULT_FILTERS,
    region: initialRegion && initialRegion !== 'All' ? initialRegion : 'All',
  }

  const [filters, setFilters] = useState<ListingFiltersState>(initial)
  const [applied, setApplied] = useState<ListingFiltersState>(initial)

  const filtered = useMemo(
    () => listings.filter((item) => matchesListingFilters(item, applied)),
    [listings, applied]
  )

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />

      <section className="bg-[#1A2744] py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('pageTitle')}
          </h1>
          <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 -mt-8 relative z-10 mb-4">
        <div className="max-w-5xl mx-auto">
          <SearchFilterBar
            value={filters}
            onChange={setFilters}
            onSearch={() => setApplied(filters)}
          />
        </div>
      </section>

      <section className="bg-[#FAF7F0] py-12 md:py-16 px-6">
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <DisclaimerFooter />
      </div>
    </main>
  )
}
