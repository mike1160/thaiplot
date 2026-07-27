import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
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

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('disclaimerEyebrow')}
        title={t('disclaimerHeroTitle')}
        subtitle={t('disclaimerHeroSubtitle')}
        image={HERO_PHOTOS.disclaimer}
        size="secondary"
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#5C5247] leading-relaxed mb-10">{t('disclaimerIntro')}</p>

        <div className="space-y-8 mb-14">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="text-xl font-bold text-[#1A2744] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {section.title}
              </h2>
              <p className="text-[#5C5247] leading-relaxed text-sm md:text-base">{section.body}</p>
            </div>
          ))}
        </div>

        <section
          id="warnings"
          className="scroll-mt-24 border border-amber-600/40 bg-[#FAF7F0] rounded-[12px] p-6 md:p-8 mb-10"
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1A2744] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('warningsTitle')}
          </h2>
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

        <section className="bg-white border border-[#E8E2D6] rounded-[12px] p-6 md:p-8 mb-12">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1A2744] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('aboutTitle')}
          </h2>
          <p className="text-[#5C5247] leading-relaxed text-sm md:text-base whitespace-pre-line">
            {t('aboutBody')}
          </p>
        </section>

        <DisclaimerFooter />
      </section>
    </main>
  )
}
