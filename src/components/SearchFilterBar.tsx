'use client'

import { useTranslations } from 'next-intl'
import {
  CATEGORY_FILTERS,
  FILTER_REGIONS,
  PROPERTY_TYPES,
  TRANSACTIONS,
  type ListingFiltersState,
} from '@/lib/listing-ui'

type Props = {
  value: ListingFiltersState
  onChange: (next: ListingFiltersState) => void
  onSearch?: (next?: ListingFiltersState) => void
  className?: string
}

const selectClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-[#FAF7F0] px-3 py-2.5 text-sm text-[#1A2744] focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'

export default function SearchFilterBar({ value, onChange, onSearch, className = '' }: Props) {
  const t = useTranslations('listings')
  const showPropertyType =
    value.category === 'All' || value.category === 'Land & Property'

  return (
    <div
      className={`bg-white rounded-[12px] py-4 px-4 sm:px-6 border border-[#E8E2D6] max-w-full overflow-hidden ${className}`}
      style={{ boxShadow: '0 8px 24px rgba(26,39,68,0.08)' }}
    >
      <div className="flex sm:flex-wrap gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORY_FILTERS.map((cat) => {
          const active = value.category === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                const next = {
                  ...value,
                  category: cat.value,
                  propertyType:
                    cat.value === 'Land & Property' || cat.value === 'All'
                      ? value.propertyType
                      : 'All',
                }
                onChange(next)
                onSearch?.(next)
              }}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#FAF7F0] text-[#1A2744] border border-[#E8E2D6] hover:border-amber-600/50'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-end min-w-0">
        {showPropertyType ? (
          <label className="block min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
              {t('propertyType')}
            </span>
            <select
              className={selectClass}
              value={value.propertyType}
              onChange={(e) => onChange({ ...value, propertyType: e.target.value })}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? t('filterAllTypes') : type}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="hidden lg:block" />
        )}

        <label className="block min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
            {t('region')}
          </span>
          <select
            className={selectClass}
            value={value.region}
            onChange={(e) => onChange({ ...value, region: e.target.value })}
          >
            {FILTER_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region === 'All' ? t('filterAllRegions') : region}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
            {t('filterTransaction')}
          </span>
          <select
            className={selectClass}
            value={value.transaction}
            onChange={(e) => onChange({ ...value, transaction: e.target.value })}
          >
            {TRANSACTIONS.map((tx) => (
              <option key={tx} value={tx}>
                {tx === 'For Sale'
                  ? t('badgeSale')
                  : tx === 'For Rent'
                    ? t('badgeRent')
                    : t('badgeBoth')}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'listing_filter', {
                category: value.category,
                property_type: value.propertyType,
                region: value.region,
                transaction: value.transaction,
              })
            }
            onSearch?.()
          }}
          className="w-full min-h-[44px] rounded-[12px] text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
        >
          {t('searchButton')}
        </button>
      </div>
    </div>
  )
}
