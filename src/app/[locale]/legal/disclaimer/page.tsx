import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import OfficialGovResources, {
  type GovCategory,
} from '@/components/OfficialGovResources'
import { localizedPath, SITE_URL } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'legal' })
  return {
    title: t('disclaimerMetaTitle'),
    description: t('disclaimerMetaDescription'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: localizedPath(params.locale, '/legal/disclaimer'),
    },
    metadataBase: new URL(SITE_URL),
  }
}

export default async function DisclaimerPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('legal')
  const sections = t.raw('disclaimerSections') as Array<{ title: string; body: string }>
  const warnings = t.raw('thailandWarnings') as Array<{ title: string; body: string }>
  const govCategories = t.raw('govCategories') as GovCategory[]

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('disclaimerEyebrow')}
        title={t('disclaimerHeroTitle')}
        subtitle={t('disclaimerHeroSubtitle')}
        image={HERO_PHOTOS.disclaimer}
        size="secondary"
      />

      <section className="relative max-w-4xl mx-auto px-6 py-16">
        <div
          className="pointer-events-none absolute inset-x-3 top-8 bottom-8 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.45) 100%)',
          }}
          aria-hidden
        />
        <p className="text-[#5C5247] leading-relaxed mb-10">{t('disclaimerIntro')}</p>

        <div className="space-y-8 mb-14">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="tp-section-title">{section.title}</h2>
              <p className="text-[#5C5247] leading-relaxed text-sm md:text-base">{section.body}</p>
            </div>
          ))}
        </div>

        <section
          id="warnings"
          className="scroll-mt-24 border border-amber-600/35 bg-white/55 rounded-[14px] p-6 md:p-8 mb-10 backdrop-blur-md shadow-[0_12px_32px_rgba(20,32,56,0.06)]"
        >
          <h2 className="tp-section-title mb-6">{t('warningsTitle')}</h2>
          <div className="space-y-6">
            {warnings.map((item) => (
              <div key={item.title} className="border-b border-[#E8E2D6] pb-5 last:border-0 last:pb-0">
                <h3 className="text-[#1A2744] font-semibold text-base md:text-lg mb-2">
                  ⚠️ {item.title}
                </h3>
                <p className="text-[#5C5247] leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <OfficialGovResources
          title={t('govResourcesTitle')}
          intro={t('govResourcesIntro')}
          note={t('govResourcesNote')}
          categories={govCategories}
        />

        <section className="bg-white/75 border border-white/70 rounded-[14px] p-6 md:p-8 mb-12 backdrop-blur-sm shadow-[0_10px_28px_rgba(20,32,56,0.05)]">
          <h2 className="tp-section-title mb-3">{t('aboutTitle')}</h2>
          <p className="text-[#5C5247] leading-relaxed text-sm md:text-base whitespace-pre-line">
            {t('aboutBody')}
          </p>
        </section>

        <DisclaimerFooter />
      </section>
    </main>
  )
}
