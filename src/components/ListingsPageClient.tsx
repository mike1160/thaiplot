'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import ListingCard from '@/components/ListingCard'
import type { PublicListing } from '@/lib/listings'
import { REGIONS } from '@/i18n/routing'

const PROPERTY_TYPES = ['All', 'Land', 'House', 'Condo', 'Villa', 'Commercial'] as const

type Props = {
  listings: PublicListing[]
  initialRegion?: string
}

export default function ListingsPageClient({ listings, initialRegion = 'All' }: Props) {
  const t = useTranslations('listings')
  const tn = useTranslations('navigation')
  const [region, setRegion] = useState(initialRegion || 'All')
  const [propertyType, setPropertyType] = useState('All')

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const regionOk =
        region === 'All' ||
        (item.region || '').toLowerCase() === region.toLowerCase() ||
        (item.location || '').toLowerCase().includes(region.toLowerCase())
      const typeOk =
        propertyType === 'All' ||
        (item.property_type || '').toLowerCase() === propertyType.toLowerCase()
      return regionOk && typeOk
    })
  }, [listings, region, propertyType])

  const typeLabel = (value: string) => {
    if (value === 'All') return t('filterAll')
    const map: Record<string, string> = {
      Land: t('typeLand'),
      House: t('typeHouse'),
      Condo: t('typeCondo'),
      Villa: t('typeVilla'),
      Commercial: t('typeCommercial'),
    }
    return map[value] || value
  }

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

      <section className="bg-white border-b border-[#E8E2D6] px-6 py-5">
        <div className="max-w-6xl mx-auto space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#5C5247] mb-2">
              {t('region')}
            </p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((item) => {
                const active = region === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRegion(item)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#1A2744] text-white'
                        : 'bg-[#FAF7F0] text-[#5C5247] border border-[#E8E2D6] hover:border-[#C8973A]'
                    }`}
                  >
                    {item === 'All' ? t('filterAll') : item}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#5C5247] mb-2">
              {t('propertyType')}
            </p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((item) => {
                const active = propertyType === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPropertyType(item)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#1A2744] text-white'
                        : 'bg-[#FAF7F0] text-[#5C5247] border border-[#E8E2D6] hover:border-[#C8973A]'
                    }`}
                  >
                    {typeLabel(item)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F0] py-12 md:py-20 px-6">
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
