import { setRequestLocale } from 'next-intl/server'
import DrinkWaterSectionView from '@/components/DrinkWaterSectionView'
import { getDrinkWaterContent } from '@/content/drinking-water'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoDrinkWater',
    path: '/info/drinking-water-thailand/advice',
  })
}

export default function DrinkingWaterAdvicePage({ params }: Props) {
  setRequestLocale(params.locale)
  const content = getDrinkWaterContent(params.locale)
  return <DrinkWaterSectionView section={content.advice} />
}
