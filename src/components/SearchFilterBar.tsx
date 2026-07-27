'use client'

import {
  FILTER_REGIONS,
  PROPERTY_TYPES,
  TRANSACTIONS,
  type ListingFiltersState,
} from '@/lib/listing-ui'

type Props = {
  value: ListingFiltersState
  onChange: (next: ListingFiltersState) => void
  onSearch?: () => void
  className?: string
}

const selectClass =
  'w-full rounded-[12px] border border-[#E8E2D6] bg-[#FAF7F0] px-3 py-2.5 text-sm text-[#1A2744] focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600'

export default function SearchFilterBar({ value, onChange, onSearch, className = '' }: Props) {
  return (
    <div
      className={`bg-white rounded-[12px] py-4 px-6 border border-[#E8E2D6] ${className}`}
      style={{ boxShadow: '0 8px 24px rgba(26,39,68,0.08)' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-end">
        <label className="block min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
            Property type
          </span>
          <select
            className={selectClass}
            value={value.propertyType}
            onChange={(e) => onChange({ ...value, propertyType: e.target.value })}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All types' : type}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
            Region
          </span>
          <select
            className={selectClass}
            value={value.region}
            onChange={(e) => onChange({ ...value, region: e.target.value })}
          >
            {FILTER_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region === 'All' ? 'All regions' : region}
              </option>
            ))}
          </select>
        </label>

        <label className="block min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[#5C5247] mb-1.5">
            Transaction
          </span>
          <select
            className={selectClass}
            value={value.transaction}
            onChange={(e) => onChange({ ...value, transaction: e.target.value })}
          >
            {TRANSACTIONS.map((tx) => (
              <option key={tx} value={tx}>
                {tx}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'listing_filter', {
                property_type: value.propertyType,
                region: value.region,
                transaction: value.transaction,
              })
            }
            onSearch?.()
          }}
          className="w-full min-h-[44px] rounded-[12px] text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
        >
          Search listings →
        </button>
      </div>
    </div>
  )
}
