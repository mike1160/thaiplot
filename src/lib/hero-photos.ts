const PEXELS_PARAMS = 'auto=compress&cs=tinysrgb&w=1400'

function pexels(idPath: string): string {
  return `https://images.pexels.com/photos/${idPath}?${PEXELS_PARAMS}`
}

export const HERO_PHOTOS = {
  home: '/hero.jpg',
  listings: pexels('1031659/pexels-photo-1031659.jpeg'),
  listProperty: pexels('2166559/pexels-photo-2166559.jpeg'),
  contact: pexels('1659438/pexels-photo-1659438.jpeg'),
  disclaimer: pexels('3184360/pexels-photo-3184360.jpeg'),
  privacy: pexels('3184360/pexels-photo-3184360.jpeg'),
  buyingGuide: pexels('2686531/pexels-photo-2686531.jpeg'),
  chanote: pexels('1031659/pexels-photo-1031659.jpeg'),
  huaHinMarket: pexels('2070033/pexels-photo-2070033.jpeg'),
  pranburi: pexels('1174732/pexels-photo-1174732.jpeg'),
  visa: pexels('3889843/pexels-photo-3889843.jpeg'),
  homeCtaListProperty: pexels('1029599/pexels-photo-1029599.jpeg'),
  homeCtaVerifyTitle: pexels('4386431/pexels-photo-4386431.jpeg'),
} as const

export type HeroPhotoKey = keyof typeof HERO_PHOTOS
