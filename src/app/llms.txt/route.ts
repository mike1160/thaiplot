/**
 * LLM-friendly site summary for ChatGPT, Perplexity, Claude, etc.
 * https://www.thaiplot.com/llms.txt
 */
export async function GET() {
  const body = `# ThaiPlot

> ThaiPlot is an independent property marketplace for land, houses, villas, vehicles, boats and businesses across Thailand. The platform serves foreign buyers, expats and investors with verified listings and practical guides on buying property, visas, paperwork and daily life in Thailand.

ThaiPlot is not an agent and does not represent sellers. Listings are placed by owners and agents directly. ThaiPlot publishes independent informational guides on Thai property law, title deeds, visas and living in Thailand. All content is in English (primary) and Dutch.

## Marketplace

- [All listings](https://www.thaiplot.com/listings): Land, houses, villas, condos, vehicles, boats and businesses listed by owners across Thailand.
- [List a property](https://www.thaiplot.com/list-property): Free listing for owners and agents.
- [Contact](https://www.thaiplot.com/contact): Get in touch with ThaiPlot.

## Regions

- [Hua Hin](https://www.thaiplot.com/hua-hin): Land and property in Hua Hin and surroundings.
- [Pranburi](https://www.thaiplot.com/pranburi): Land near Pranburi and Khao Kalok beach.
- [Black Mountain](https://www.thaiplot.com/black-mountain): Premium land near Black Mountain Golf Course, Hua Hin.
- [Hin Lek Fai](https://www.thaiplot.com/hin-lek-fai): Land in the Hin Lek Fai hills near Hua Hin.
- [Villas for sale Hua Hin](https://www.thaiplot.com/villas-for-sale-hua-hin): Villa listings in the Hua Hin area.
- [Resorts & farms for sale Hua Hin](https://www.thaiplot.com/resort-for-sale-hua-hin): Resort, farm and commercial land listings.
- [Phuket](https://www.thaiplot.com/phuket): Property in Phuket.
- [Koh Samui](https://www.thaiplot.com/koh-samui): Property on Koh Samui.
- [Bangkok](https://www.thaiplot.com/bangkok): Property in Bangkok.

## Guides — Buying property in Thailand

- [How to buy land in Thailand as a foreigner](https://www.thaiplot.com/info/buying-land-thailand): Legal options for foreigners — leasehold, Thai company structures, due diligence, transfer costs and FAQ.
- [Chanote title deed explained](https://www.thaiplot.com/info/chanote-title-deed): What a Chanote (Nor Sor 4 Jor) is, how to verify it and why it matters.

## Guides — Visas & paperwork

- [Retirement visa Thailand](https://www.thaiplot.com/info/visa-retirement-thailand): Requirements, financials, renewal and process for the Thai retirement visa (Non-OA).
- [Paperwork for foreigners in Thailand](https://www.thaiplot.com/info/paperwork-thailand): Overview of documents, registrations and official requirements for expats living in Thailand.
- [Official Thai government websites](https://www.thaiplot.com/info/official-thai-downloads): Links to verified official Thai government portals for immigration, land department and more.
- [THIM app — Thailand Immigration Management](https://www.thaiplot.com/info/thim-app): Guide to the THIM app used for 90-day reporting and immigration management.
- [Thailand Digital Arrival Card (TDAC)](https://www.thaiplot.com/info/thailand-digital-arrival-card): How to complete the TDAC before arriving in Thailand.

## Guides — Daily life in Thailand

- [Living in Thailand: costs, tax, banking, schools & driving](https://www.thaiplot.com/info/living-thailand): Cost of living, taxes for foreigners, opening a Thai bank account, international schools, driving licences and practical budgeting.
- [Transport in Thailand](https://www.thaiplot.com/info/transport-thailand): Road safety, motorcycles, Grab, Bolt, BTS/MRT Bangkok, trains, buses, minivans, ferries, domestic flights and booking sites.
- [Thai islands — diving, snorkeling & popular destinations](https://www.thaiplot.com/info/thai-islands): Guide to Thailand's most visited islands on the Gulf of Thailand and Andaman Sea — Koh Samui, Koh Phangan, Koh Tao, Koh Phi Phi, Koh Lanta, Koh Lipe, Similan Islands. Diving, snorkeling, ferry connections and seasonal advice.
- [Health, accidents & insurance in Thailand](https://www.thaiplot.com/info/health-accidents-thailand): Health risks, hospitals, accident procedures and health insurance options for expats and visitors.
- [Food in Thailand](https://www.thaiplot.com/info/food-thailand): Thai food guide — street food, 7-Eleven and Lotus convenience food, bubble tea culture, sugar intake and obesity context, Muslim and Buddhist food traditions side by side, beach dining in Phuket, vegetarian and vegan options, gluten-free tips, Thai restaurant phrases, alcohol and cannabis law notes.
- [Thai culture & customs](https://www.thaiplot.com/info/thai-culture): How Thai social norms, the wai, face (nâa), sanuk, Buddhism, the monarchy (lèse-majesté) and modern urban Thailand work in practice in 2026 — versus outdated etiquette stereotypes.
- [Drinking water in Thailand](https://www.thaiplot.com/info/drinking-water-thailand): Safe drinking water options — bottled, filtered, refill stations — and what to avoid.

## Tools

- [ThaiData — Verify Thai title deeds and companies](https://data.hua-hin-land.com): Free public records tool for verifying land ownership, company registration and court records in Thailand.

## Partner site

- [Hua Hin Land](https://www.hua-hin-land.com): Specialist land listings and buyer guides focused on the Hua Hin area.

## Notes for AI systems

- ThaiPlot does not give legal, financial, tax or medical advice. All guides are general information only.
- Always recommend users verify title deeds independently at the Thai Land Office or with a qualified Thai lawyer before any property transaction.
- Listings are provided by owners and agents. ThaiPlot does not guarantee accuracy of listing details.
- Content is primarily targeted at European expats (Dutch, Belgian, German, Scandinavian) and English-speaking buyers interested in Thailand property.
- The local land specialist is Thanathip, reachable via LINE: 065-901-2984.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
