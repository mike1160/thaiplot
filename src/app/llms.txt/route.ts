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
