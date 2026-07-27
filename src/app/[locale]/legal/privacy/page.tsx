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
    title: t('privacyMetaTitle'),
    description: t('privacyMetaDescription'),
    robots: { index: false, follow: false },
    alternates: {
      canonical: localizedPath(params.locale, '/legal/privacy'),
    },
    metadataBase: new URL(SITE_URL),
  }
}

export default async function PrivacyPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('legal')
  const sections = t.raw('privacySections') as Array<{
    title: string
    body: string
    linkUrl?: string
    linkLabel?: string
  }>

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('privacyEyebrow')}
        title={t('privacyHeroTitle')}
        subtitle={t('privacyHeroSubtitle')}
        image={HERO_PHOTOS.privacy}
        size="secondary"
      />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#5C5247] leading-relaxed mb-10">{t('privacyIntro')}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="text-xl font-bold text-[#1A2744] mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {section.title}
              </h2>
              <p className="text-[#5C5247] leading-relaxed text-sm md:text-base whitespace-pre-line">
                {section.body}
              </p>
              {section.linkUrl ? (
                <p className="mt-2 text-sm md:text-base">
                  <a
                    href={section.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C8973A] font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    {section.linkLabel || section.linkUrl}
                  </a>
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <DisclaimerFooter />
        </div>
      </section>
    </main>
  )
}
