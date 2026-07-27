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
}

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
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1A2744] mb-2">
        {label}
        {required ? ' *' : ''}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-[12px] border border-[#E8E2D6] bg-white px-4 py-3 text-sm text-[#1A2744] focus:outline-none focus:ring-2 focus:ring-amber-600/40 focus:border-amber-600"
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
