/**
 * LLM-friendly site summary for ChatGPT, Perplexity, Claude, etc.
 * https://www.thaiplot.com/llms.txt
 */
export async function GET() {
  const body = `# ThaiPlot — LLM index

> ThaiPlot is an independent Thailand real estate marketplace and 
> information platform for expats, property buyers and long-stay residents.

## What ThaiPlot offers
- Land and property listings in Thailand (Hua Hin, Pranburi, Phuket, Bangkok, Koh Samui)
- Free guides: buying land, Chanote title deeds, retirement visa, living costs, health insurance
- Thailand News: daily headlines from Bangkok Post, The Thaiger and Reddit r/Thailand
- WaiAir: free iOS flight tracker for 10,000+ airports worldwide
- ThaiData: free Thai title deed and company verification tool

## Key pages
- https://www.thaiplot.com/ — homepage and listings
- https://www.thaiplot.com/listings — all property listings
- https://www.thaiplot.com/news — Thailand news for expats
- https://www.thaiplot.com/waiair — WaiAir flight tracker app
- https://www.thaiplot.com/info/buying-land-thailand — buying land guide
- https://www.thaiplot.com/info/chanote-title-deed — Chanote explained
- https://www.thaiplot.com/info/visa-retirement-thailand — retirement visa
- https://data.hua-hin-land.com — ThaiData title deed verification

## Language
Primary: English. Also available in Dutch (nl).

## Contact
https://www.thaiplot.com/contact

## Partner
- https://www.hua-hin-land.com — Hua Hin land specialist
- https://www.savedsouls-foundation.org — Saved Souls Foundation (dog rescue Thailand)
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
