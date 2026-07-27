/** Shared contact endpoints for phone, WhatsApp and LINE. */
export const AGENT_NAME = 'Thanathip'
export const AGENT_PHONE = '0659012984'
export const AGENT_PHONE_DISPLAY = '065-901-2984'
export const WHATSAPP_URL = 'https://wa.me/6659012984'
export const LINE_AGENT_URL = 'https://line.me/ti/p/~0659012984'
export const LINE_URL = LINE_AGENT_URL

export type FeaturedAgentListing = {
  id: string
  emoji: string
  title: string
  details: string[]
  href?: string
}

export const THANATHIP_LISTINGS: FeaturedAgentListing[] = [
  {
    id: '1',
    emoji: '🌲',
    title: 'Prime land — Mountain view | Hua Hin Soi 112',
    details: [
      '4 Rai 2 Ngan',
      'Flat',
      'Chanote',
      'Water + electricity',
      '15 min to beach',
    ],
    href: 'https://www.hua-hin-land.com',
  },
  {
    id: '2',
    emoji: '📍',
    title: 'Land with mountain view | Hua Hin – Khao Ta – Pak Nam Pran',
    details: ['Scenic area', 'Good title deed', 'Contact for details'],
  },
  {
    id: '3',
    emoji: '🏖️',
    title: 'Beautiful land near Pranburi beach (Pak Nam Khao Kra Hok)',
    details: ['Near sea', 'Good location', 'Contact for details'],
  },
  {
    id: '4',
    emoji: '🏔️',
    title: 'Mountain view land near Khao Lang Kan | 300 rai — Sam Roi Yod',
    details: ['Near beach', 'Nor Sor Kru Ta Daeng title', 'Large plot'],
  },
  {
    id: '5',
    emoji: '💎',
    title: 'Land for sale Hua Hin — Black Mountain zone (2 Rai)',
    details: ['Near Black Mountain Golf', 'Contact for details'],
  },
  {
    id: '6',
    emoji: '🌄',
    title: 'Chanote land — mountain view | Hua Hin Thap Tai area',
    details: ['Good atmosphere', 'Chanote title', 'Contact for details'],
  },
]
