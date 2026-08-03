/** Official Thai government / authority links. Placeholders marked for URLs still TBD. */

export const TH_PL_PHOTOS = {
  1: '/th-pl-1.JPG',
  2: '/th-pl-2.JPG',
  3: '/th-pl-3.JPG',
  4: '/th-pl-4.JPG',
  5: '/th-pl-5.JPG',
  6: '/th-pl-6.JPG',
} as const

export type OfficialLinkId =
  | 'immigration'
  | 'evisa'
  | 'tm30'
  | 'landDept'
  | 'dlt'
  | 'revenue'
  | 'boiLtr'
  | 'mfa'
  | 'thaid'
  | 'digitalGov'
  | 'policeClearance'
  | 'ssf'

export type OfficialCategoryId =
  | 'immigration'
  | 'land'
  | 'transport'
  | 'tax'
  | 'digital'
  | 'other'

export type OfficialLinkDef = {
  id: OfficialLinkId
  category: OfficialCategoryId
  /** Official URL, or null = placeholder until confirmed */
  href: string | null
  photo: keyof typeof TH_PL_PHOTOS
}

export const OFFICIAL_CATEGORIES: OfficialCategoryId[] = [
  'immigration',
  'land',
  'transport',
  'tax',
  'digital',
  'other',
]

export const CATEGORY_PHOTOS: Record<OfficialCategoryId, keyof typeof TH_PL_PHOTOS> = {
  immigration: 2,
  land: 1,
  transport: 3,
  tax: 5,
  digital: 4,
  other: 6,
}

export const OFFICIAL_LINKS: OfficialLinkDef[] = [
  {
    id: 'immigration',
    category: 'immigration',
    href: 'https://www.immigration.go.th',
    photo: 2,
  },
  {
    id: 'evisa',
    category: 'immigration',
    href: 'https://www.thaievisa.go.th',
    photo: 2,
  },
  {
    id: 'tm30',
    category: 'immigration',
    href: null,
    photo: 6,
  },
  {
    id: 'landDept',
    category: 'land',
    href: 'https://www.dol.go.th',
    photo: 1,
  },
  {
    id: 'dlt',
    category: 'transport',
    href: 'https://www.dlt.go.th',
    photo: 3,
  },
  {
    id: 'revenue',
    category: 'tax',
    href: 'https://www.rd.go.th',
    photo: 5,
  },
  {
    id: 'boiLtr',
    category: 'immigration',
    href: 'https://ltr.boi.go.th',
    photo: 2,
  },
  {
    id: 'mfa',
    category: 'other',
    href: 'https://www.mfa.go.th',
    photo: 6,
  },
  {
    id: 'thaid',
    category: 'digital',
    href: null,
    photo: 4,
  },
  {
    id: 'digitalGov',
    category: 'digital',
    href: 'https://www.dga.or.th',
    photo: 4,
  },
  {
    id: 'policeClearance',
    category: 'other',
    href: null,
    photo: 3,
  },
  {
    id: 'ssf',
    category: 'other',
    href: null,
    photo: 5,
  },
]
