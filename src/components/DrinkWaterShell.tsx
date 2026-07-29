import { type ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import DrinkWaterSubnav from '@/components/DrinkWaterSubnav'

type Props = {
  children: ReactNode
}

export default async function DrinkWaterShell({ children }: Props) {
  const t = await getTranslations('infoDrinkWater')

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1A2933]">
      <BreadcrumbNav />

      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #0A3D5C 0%, #1A7BA4 55%, #1A2744 100%)',
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
          <p className="text-xs text-[#8DB4C8] leading-relaxed mb-2">{t('footerSources')}</p>
          <p className="text-xs text-[#8DB4C8] mb-6">{t('footerNote')}</p>
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}
