import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'de', 'th'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

export type AppLocale = (typeof routing.locales)[number]

export const REGIONS = [
  'All',
  'Hua Hin',
  'Phuket',
  'Pranburi',
  'Chiang Mai',
  'Koh Samui',
  'Bangkok',
] as const

export const LIST_REGIONS = [
  'Hua Hin',
  'Phuket',
  'Pranburi',
  'Chiang Mai',
  'Koh Samui',
  'Bangkok',
  'Other',
] as const
