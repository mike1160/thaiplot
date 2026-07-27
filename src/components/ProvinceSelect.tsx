'use client'

import { THAI_PROVINCE_GROUPS } from '@/lib/thai-provinces'

type Props = {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  required?: boolean
  className?: string
  labelClassName?: string
}

const selectClass =
  'w-full appearance-none rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 pr-10 text-sm text-[#1A2744] focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600 bg-[length:16px_16px] bg-[right_0.9rem_center] bg-no-repeat'

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235C5247'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")"

/**
 * Thai province dropdown (77 provinces in regional optgroups).
 * Value is stored as listings.region in Supabase.
 */
export default function ProvinceSelect({
  id = 'region',
  name = 'region',
  value,
  onChange,
  label,
  placeholder,
  required = true,
  className = selectClass,
  labelClassName = 'block text-sm font-medium text-[#1A2744] mb-2',
}: Props) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required ? ' *' : ''}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={className}
        style={{ backgroundImage: CHEVRON }}
      >
        <option value="">{placeholder}</option>
        {THAI_PROVINCE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
