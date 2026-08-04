import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

type Phrase = { th: string; roman: string; meaning: string }

function SectionBody({ paras }: { paras: string[] }) {
  return (
    <>
      {paras.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
    </>
  )
}

function ListBody({ intro, items }: { intro?: string; items: string[] }) {
  return (
    <>
      {intro ? <p>{intro}</p> : null}
      <ul className="list-disc space-y-1.5 pl-5">
        {items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </>
  )
}

function PhrasesBody({
  intro,
  phrases,
}: {
  intro: string
  phrases: Phrase[]
}) {
  return (
    <>
      <p>{intro}</p>
      <ul className="mt-4 space-y-3">
        {phrases.map((p) => (
          <li
            key={p.th}
            className="rounded-[12px] border border-[#E8E2D6] bg-white/80 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-base font-semibold text-[#1A2744]" lang="th">
              {p.th}
            </p>
            <p className="mt-0.5 text-sm text-[#C8973A]">{p.roman}</p>
            <p className="mt-1 text-sm text-[#5C5247]">{p.meaning}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function FaqBody({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <dl className="space-y-5">
      {faqs.map((faq) => (
        <div key={faq.q}>
          <dt className="mb-1 font-semibold text-[#1A2744]">{faq.q}</dt>
          <dd>{faq.a}</dd>
        </div>
      ))}
    </dl>
  )
}

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoFood',
    path: '/info/food-thailand',
  })
}

export default async function FoodThailandPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoFood')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, '/info/food-thailand')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/food-thailand"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={HERO_PHOTOS.food}
      />
      <FaqJsonLd
        faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))}
        pageUrl={pageUrl}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.food') },
        ]}
      />
      <InfoPageShell
        title={t('title')}
        subtitle={t('subtitle')}
        heroImage={HERO_PHOTOS.food}
        sections={[
          {
            title: t('tasty.title'),
            body: <SectionBody paras={t.raw('tasty.paras') as string[]} />,
          },
          {
            title: t('risks.title'),
            body: (
              <ListBody
                intro={t('risks.intro')}
                items={t.raw('risks.items') as string[]}
              />
            ),
          },
          {
            title: t('vegetarian.title'),
            body: <SectionBody paras={t.raw('vegetarian.paras') as string[]} />,
          },
          {
            title: t('gluten.title'),
            body: <SectionBody paras={t.raw('gluten.paras') as string[]} />,
          },
          {
            title: t('phrases.title'),
            body: (
              <PhrasesBody
                intro={t('phrases.intro')}
                phrases={t.raw('phrases.items') as Phrase[]}
              />
            ),
          },
          {
            title: t('alcohol.title'),
            body: <SectionBody paras={t.raw('alcohol.paras') as string[]} />,
          },
          {
            title: t('drugs.title'),
            body: <SectionBody paras={t.raw('drugs.paras') as string[]} />,
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
            <p className="border-l-2 border-[#C8973A] pl-4 text-sm leading-relaxed text-[#5C5247]">
              {t('foodNote')}
            </p>
            <RelatedGuides
              title={tp('relatedOnThaiPlot')}
              links={[
                { href: '/info/drinking-water-thailand', label: tp('linkDrinkWater') },
                { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
                { href: '/info/transport-thailand', label: tp('linkTransport') },
                { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
                { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
              ]}
            />
          </div>
        }
      />
    </>
  )
}
