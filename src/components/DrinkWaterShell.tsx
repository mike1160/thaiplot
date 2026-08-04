import { type ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import DrinkWaterSubnav from '@/components/DrinkWaterSubnav'
import RelatedGuides from '@/components/RelatedGuides'

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
    return {
      url: photo.src.large2x as string,
      photographer: photo.photographer as string,
      link: photo.url as string,
    }
  } catch {
    return null
  }
}

export default async function DrinkWaterShell({ children }: Props) {
  const t = await getTranslations('infoDrinkWater')
  const tp = await getTranslations('partnerLinks')
  const photo = await fetchHeroPhoto()

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1A2933]">
      <BreadcrumbNav />

      <section className="relative overflow-hidden text-white">

        {/* Achtergrond: Pexels foto of fallback gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={
            photo
              ? { backgroundImage: `url(${photo.url})` }
              : { background: 'linear-gradient(160deg, #0A3D5C 0%, #1A7BA4 55%, #1A2744 100%)' }
          }
        />

        {/* Donkere overlay zodat tekst altijd leesbaar is */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(10,61,92,0.82) 0%, rgba(26,123,164,0.58) 100%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-14 md:pt-24 md:pb-16 text-center">
          <p className="text-[#8DB4C8] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1
            className="text-3xl md:text-5xl font-light tracking-wide leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-base md:text-lg font-light opacity-90 max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Pexels fotocredit */}
        {photo && (
          <a
            href={photo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-12 right-3 z-10 text-[0.65rem] text-white/50 hover:text-white/80 transition-colors"
          >
            📷 {photo.photographer} via Pexels
          </a>
        )}

        <svg
          className="relative block w-full h-10 md:h-12"
          viewBox="0 0 1200 50"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,35 C300,65 900,5 1200,35 L1200,0 L0,0 Z" fill="#1A7BA4" opacity="0.35" />
          <path d="M0,45 C400,15 800,60 1200,30 L1200,0 L0,0 Z" fill="#F5F0E8" />
        </svg>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <DrinkWaterSubnav />
        <article>{children}</article>

        <div className="mt-12 pt-6 border-t border-[#D4E4EC]">
          <RelatedGuides
            title={t('relatedTitle')}
            links={[
              { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
              { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
              { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
              { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
              { href: '/info/thim-app', label: tp('linkThim') },
            ]}
          />
          <p className="text-xs text-[#8DB4C8] leading-relaxed mb-2 mt-8">{t('footerSources')}</p>
          <p className="text-xs text-[#8DB4C8] mb-6">{t('footerNote')}</p>
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}
