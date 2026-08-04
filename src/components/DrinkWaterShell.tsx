import { type ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import DrinkWaterSubnav from '@/components/DrinkWaterSubnav'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = {
  children: ReactNode
}

async function fetchHeroPhoto() {
  const key = process.env.NEXT_PUBLIC_PEXELS_API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      'https://api.pexels.com/v1/search?query=Phuket+water+tropical&per_page=5&orientation=landscape',
      {
        headers: { Authorization: key },
        next: { revalidate: 86400 },
      }
    )
    const data = await res.json()
    if (!data.photos?.length) return null
    const photo = data.photos[Math.floor(Math.random() * Math.min(3, data.photos.length))]
    return photo.src.large2x as string
  } catch {
    return null
  }
}

export default async function DrinkWaterShell({ children }: Props) {
  const t = await getTranslations('infoDrinkWater')
  const tp = await getTranslations('partnerLinks')
  const photo = (await fetchHeroPhoto()) || HERO_PHOTOS.visa

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} image={photo} />

      <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-8 md:pt-10">
        <div
          className="pointer-events-none absolute inset-x-3 top-4 bottom-4 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.45) 100%)',
          }}
          aria-hidden
        />
        <DrinkWaterSubnav />
        <article className="tp-body">{children}</article>

        <div className="mt-12 space-y-8 border-t border-[#E8E2D6] pt-8">
          <RelatedGuides
            title={t('relatedTitle')}
            links={[
              { href: '/info/drinking-water-thailand', label: tp('linkDrinkWater') },
              { href: '/info/food-thailand', label: tp('linkFood') },
              { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
              { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
              { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
              { href: '/info/thim-app', label: tp('linkThim') },
            ]}
          />
          <p className="text-xs leading-relaxed text-[#8A7F72]">{t('footerSources')}</p>
          <p className="text-xs text-[#8A7F72]">{t('footerNote')}</p>
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}
