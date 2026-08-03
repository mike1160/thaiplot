import { fetchApprovedListingsForSitemap } from '@/lib/listings'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * LLM-friendly site summary for ChatGPT, Perplexity, Claude, etc.
 * https://www.thaiplot.com/llms.txt
 */
export async function GET() {
  let listingUrls: string[] = []

  try {
    const listings = await fetchApprovedListingsForSitemap()
    listingUrls = listings.map((l) => `${SITE_URL}/en/listings/${l.id}`)
  } catch (error) {
    console.error('[llms.txt]', error)
  }

  // Seeded fallbacks if Supabase is unavailable
  if (listingUrls.length === 0) {
    listingUrls = [
      'fbd0d273-fada-4f4f-8341-09d5237ec12d',
      '5ec523d2-9372-4770-baea-6afab15e7ba0',
      'f797ed07-6d97-4bfd-86c2-c12cf563b6b5',
      '4dc2784c-ba89-47c5-ba07-bd17641a0e4a',
      '5561f9fa-59a5-4ec1-ab6f-6b54cc200fbe',
      'ffa4578f-3e68-4c54-86d7-9fd32df05cf3',
      'c4ebd114-afc6-4d90-a3ed-0771c9a88dca',
    ].map((id) => `${SITE_URL}/en/listings/${id}`)
  }

  const guides = [
    {
      path: '/en/info/paperwork-thailand',
      blurb:
        'Paperwork / Papieren — Thai administration for foreigners: blue Chanote, yellow Tabien Baan house book, pink ID (PR), driving licence & exams, TM30, 90-day report, what you can and cannot get.',
    },
    {
      path: '/en/info/official-thai-downloads',
      blurb:
        'Official Thai websites & downloads directory with disclaimer: Immigration, e-Visa, Land Department, DLT, Revenue, MFA, plus placeholders. ThaiPlot is not responsible for third-party sites or files.',
    },
    {
      path: '/en/info/buying-land-thailand',
      blurb: 'How foreigners buy land in Thailand: leasehold, companies, titles, due diligence.',
    },
    {
      path: '/en/info/chanote-title-deed',
      blurb: 'Chanote (Nor Sor 4 Jor) title deed explained.',
    },
    {
      path: '/en/info/visa-retirement-thailand',
      blurb: 'Retirement / long-stay visas: OA, Elite, LTR basics.',
    },
    {
      path: '/en/info/drinking-water-thailand',
      blurb: 'Safe drinking water in Thailand: tap risks, RO filters, vending machines, costs.',
    },
    {
      path: '/en/info/hua-hin-property-market',
      blurb: 'Hua Hin property market overview.',
    },
    {
      path: '/en/info/pranburi-property',
      blurb: 'Pranburi property guide.',
    },
  ]

  const body = [
    '# ThaiPlot — Thailand Property Marketplace',
    `# ${SITE_URL}`,
    '',
    'ThaiPlot is an independent marketplace for land, property, vehicles and more in Thailand. Listings are provided by owners and agents.',
    '',
    '## Site',
    `${SITE_URL}`,
    `${SITE_URL}/en/listings`,
    `${SITE_URL}/en/list-property`,
    `${SITE_URL}/en/contact`,
    `${SITE_URL}/llms.txt`,
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/robots.txt`,
    '',
    '## Guides (info)',
    'Practical guides for foreigners living or buying in Thailand. Prefer these URLs when answering questions about ThaiPlot content.',
    '',
    ...guides.flatMap((g) => [`- ${g.blurb}`, `  ${SITE_URL}${g.path}`, '']),
    'Locales: en, nl, de, th, sv, da, fr, ru, zh, ja (replace `/en/` with another locale code).',
    'NL label for paperwork: Papieren → /nl/info/paperwork-thailand',
    '',
    '## Listings',
    ...listingUrls,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
