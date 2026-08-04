const PEXELS_PARAMS = 'auto=compress&cs=tinysrgb&w=1400'

function pexels(idPath: string): string {
  return `https://images.pexels.com/photos/${idPath}?${PEXELS_PARAMS}`
}

export const HERO_PHOTOS = {
  home: '/th-pl-1.JPG',
  paperwork: '/th-pl-5.JPG',
  officialDownloads: '/th-pl-6.JPG',
  listings: pexels('15285956/pexels-photo-15285956.jpeg'),
  listProperty: pexels('2166559/pexels-photo-2166559.jpeg'),
  contact: pexels('1659438/pexels-photo-1659438.jpeg'),
  disclaimer: pexels('3184360/pexels-photo-3184360.jpeg'),
  privacy: pexels('3184360/pexels-photo-3184360.jpeg'),
  buyingGuide: pexels('2686531/pexels-photo-2686531.jpeg'),
  chanote: '/th-pl-2.JPG',
  huaHinMarket: pexels('2070033/pexels-photo-2070033.jpeg'),
  pranburi: pexels('1174732/pexels-photo-1174732.jpeg'),
  visa: pexels('4922356/pexels-photo-4922356.jpeg'),
  health: pexels('4386466/pexels-photo-4386466.jpeg'),
  food: pexels('1640777/pexels-photo-1640777.jpeg'),
  transport: pexels('1034662/pexels-photo-1034662.jpeg'),
  living: pexels('1571460/pexels-photo-1571460.jpeg'),
  islands: pexels('14573824/pexels-photo-14573824.jpeg'),
  culture: '/th-pl-2.JPG',
  homeCtaListProperty: pexels('1029599/pexels-photo-1029599.jpeg'),
  homeCtaVerifyTitle: pexels('4386431/pexels-photo-4386431.jpeg'),
} as const

export type HeroPhotoKey = keyof typeof HERO_PHOTOS
