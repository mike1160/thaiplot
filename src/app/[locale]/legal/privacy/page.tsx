import { getTranslations, setRequestLocale } from 'next-intl/server'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'

type Props = { params: { locale: string } }

export default async function PrivacyPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('legal')

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t('privacyTitle')}
        </h1>
        <p className="text-[#5C5247] leading-relaxed">{t('privacyBody')}</p>
        <div className="mt-12">
          <DisclaimerFooter />
        </div>
      </section>
    </main>
  )
}
