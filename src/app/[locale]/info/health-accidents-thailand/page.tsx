import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

function SectionBody({ paras }: { paras: string[] }) {
  return (
    <>
      {paras.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
    </>
  )
}

function FaqBody({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <dl className="space-y-5">
      {faqs.map((faq) => (
        <div key={faq.q}>
          <dt className="font-semibold text-[#1A2744] mb-1">{faq.q}</dt>
          <dd>{faq.a}</dd>
        </div>
      ))}
    </dl>
  )
}

function ListBody({ intro, items }: { intro?: string; items: string[] }) {
  return (
    <>
      {intro ? <p>{intro}</p> : null}
      <ul className="list-disc pl-5 space-y-1.5">
        {items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoHealth',
    path: '/info/health-accidents-thailand',
  })
}

export default async function HealthAccidentsPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoHealth')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, '/info/health-accidents-thailand')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/health-accidents-thailand"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.health}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.guide'), path: '/info/buying-land-thailand' },
          { name: tb('pages.health') },
        ]}
      />
      <InfoPageShell
        title={t('title')}
        subtitle={t('subtitle')}
        heroImage={HERO_PHOTOS.health}
        sections={[
          {
            title: t('overview.title'),
            body: <SectionBody paras={t.raw('overview.paras') as string[]} />,
          },
          {
            title: t('system.title'),
            body: <SectionBody paras={t.raw('system.paras') as string[]} />,
          },
          {
            title: t('costs.title'),
            body: (
              <ListBody
                intro={t('costs.intro')}
                items={t.raw('costs.items') as string[]}
              />
            ),
          },
          {
            title: t('insuranceLocal.title'),
            body: <SectionBody paras={t.raw('insuranceLocal.paras') as string[]} />,
          },
          {
            title: t('insuranceWorld.title'),
            body: <SectionBody paras={t.raw('insuranceWorld.paras') as string[]} />,
          },
          {
            title: t('accidents.title'),
            body: <SectionBody paras={t.raw('accidents.paras') as string[]} />,
          },
          {
            title: t('prescriptions.title'),
            body: <SectionBody paras={t.raw('prescriptions.paras') as string[]} />,
          },
          {
            title: t('otc.title'),
            body: (
              <ListBody intro={t('otc.intro')} items={t.raw('otc.items') as string[]} />
            ),
          },
          {
            title: t('pharmacies.title'),
            body: <SectionBody paras={t.raw('pharmacies.paras') as string[]} />,
          },
          {
            title: t('checklist.title'),
            body: <ListBody items={t.raw('checklist.items') as string[]} />,
          },
          {
            title: t('faqTitle'),
            body: <FaqBody faqs={faqs} />,
          },
        ]}
        bottomSlot={
          <div className="space-y-6">
            <p className="text-sm text-[#5C5247] leading-relaxed border-l-2 border-[#C8973A] pl-4">
              {t('medicalNote')}
            </p>
            <RelatedGuides
              title={tp('relatedOnThaiPlot')}
              links={[
                { href: '/info/drinking-water-thailand', label: tp('linkDrinkWater') },
                { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
                { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
                { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
              ]}
            />
          </div>
        }
      />
    </>
  )
}
