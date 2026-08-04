import { setRequestLocale } from 'next-intl/server'
import DrinkWaterSectionView from '@/components/DrinkWaterSectionView'
import { FaqJsonLd } from '@/components/SeoJsonLd'
import { getDrinkWaterContent } from '@/content/drinking-water'
import { buildPageMetadata, localizedPath } from '@/lib/seo'

type Props = { params: { locale: string } }

const DRINK_WATER_FAQS = [
  {
    question: 'Can you drink tap water in Thailand?',
    answer:
      'No. Tap water in Thailand is not safe to drink directly. Use sealed bottled water, filtered water or water from refill stations.',
  },
  {
    question: 'Is ice safe in Thailand?',
    answer:
      'Ice in tourist areas and restaurants is usually commercially produced and safe. If your stomach is already sensitive, skip ice to be cautious.',
  },
  {
    question: 'What is the cheapest safe water option in Thailand?',
    answer:
      'Water refill stations (found at convenience stores and street kiosks) typically charge 1 baht per litre and are the most affordable option for daily use.',
  },
]

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoDrinkWater',
    path: '/info/drinking-water-thailand',
  })
}

export default function DrinkingWaterSituationPage({ params }: Props) {
  setRequestLocale(params.locale)
  const content = getDrinkWaterContent(params.locale)
  const pageUrl = localizedPath(params.locale, '/info/drinking-water-thailand')

  return (
    <>
      <FaqJsonLd faqs={DRINK_WATER_FAQS} pageUrl={pageUrl} />
      <DrinkWaterSectionView section={content.situation} />
    </>
  )
}
