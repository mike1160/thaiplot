import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

type Phrase = { th: string; roman: string; meaning: string }

const FOOD_PHOTOS = {
  tasty: {
    src: '/food/street-vendors.png',
    alt: 'Thai street food vendors at a busy stall',
  },
  streetFood: {
    src: '/food/bite-burger-stall.png',
    alt: 'Modern Thai street food stall Bite Burger at night',
  },
  sevenEleven: {
    src: '/food/tesco-lotus.png',
    alt: 'Lotus supermarket and food stalls — everyday convenience food Thailand',
  },
  bubbleTea: {
    src: '/food/cameron-bubble-tea.png',
    alt: 'Bubble tea stall Cameron Café Thailand',
  },
  sugarObesity: {
    src: '/food/bakery-pastries.png',
    alt: 'Sweet bakery pastries in a Thai supermarket',
  },
  muslimBuddhist: {
    src: '/food/skewers-muslim.png',
    alt: 'Street food skewers stall with Muslim vendor Thailand',
  },
  beachPhuket: {
    src: '/food/beach-seafood.png',
    alt: 'Eating seafood on the beach in Phuket Thailand',
  },
  vegetarian: {
    src: '/food/beach-veggies.png',
    alt: 'Vegetable stir-fry meal on a Thailand beach',
  },
  risks: {
    src: '/food/tom-kha-beach.png',
    alt: 'Tom kha soup at a beachside restaurant Thailand',
  },
} as const

function SectionBody({
  paras,
  extraPhotos,
}: {
  paras: string[]
  extraPhotos?: { src: string; alt: string }[]
}) {
  return (
    <>
      {paras.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
      {extraPhotos && extraPhotos.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {extraPhotos.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={900}
              height={260}
              loading="lazy"
              className="h-[200px] w-full rounded-[8px] object-cover sm:h-[240px]"
            />
          ))}
        </div>
      ) : null}
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
            image: FOOD_PHOTOS.tasty.src,
            imageAlt: FOOD_PHOTOS.tasty.alt,
            body: <SectionBody paras={t.raw('tasty.paras') as string[]} />,
          },
          {
            title: t('streetFood.title'),
            image: FOOD_PHOTOS.streetFood.src,
            imageAlt: FOOD_PHOTOS.streetFood.alt,
            body: <SectionBody paras={t.raw('streetFood.paras') as string[]} />,
          },
          {
            title: t('sevenEleven.title'),
            image: FOOD_PHOTOS.sevenEleven.src,
            imageAlt: FOOD_PHOTOS.sevenEleven.alt,
            body: <SectionBody paras={t.raw('sevenEleven.paras') as string[]} />,
          },
          {
            title: t('bubbleTea.title'),
            image: FOOD_PHOTOS.bubbleTea.src,
            imageAlt: FOOD_PHOTOS.bubbleTea.alt,
            body: <SectionBody paras={t.raw('bubbleTea.paras') as string[]} />,
          },
          {
            title: t('sugarObesity.title'),
            image: FOOD_PHOTOS.sugarObesity.src,
            imageAlt: FOOD_PHOTOS.sugarObesity.alt,
            body: <SectionBody paras={t.raw('sugarObesity.paras') as string[]} />,
          },
          {
            title: t('muslimBuddhist.title'),
            image: FOOD_PHOTOS.muslimBuddhist.src,
            imageAlt: FOOD_PHOTOS.muslimBuddhist.alt,
            body: (
              <SectionBody paras={t.raw('muslimBuddhist.paras') as string[]} />
            ),
          },
          {
            title: t('beachPhuket.title'),
            image: FOOD_PHOTOS.beachPhuket.src,
            imageAlt: FOOD_PHOTOS.beachPhuket.alt,
            body: (
              <SectionBody
                paras={t.raw('beachPhuket.paras') as string[]}
                extraPhotos={[
                  {
                    src: '/food/beach-veggies.png',
                    alt: 'Vegetable meal on Phuket beach Thailand',
                  },
                  {
                    src: '/food/tom-kha-beach.png',
                    alt: 'Tom kha soup beach dining Thailand',
                  },
                  {
                    src: '/food/phuket-old-town.png',
                    alt: 'Phuket Old Town Sino-Portuguese architecture',
                  },
                  {
                    src: '/food/beach-dog.png',
                    alt: 'Phuket beach atmosphere Thailand',
                  },
                ]}
              />
            ),
          },
          {
            title: t('risks.title'),
            image: FOOD_PHOTOS.risks.src,
            imageAlt: FOOD_PHOTOS.risks.alt,
            body: (
              <ListBody
                intro={t('risks.intro')}
                items={t.raw('risks.items') as string[]}
              />
            ),
          },
          {
            title: t('vegetarian.title'),
            image: FOOD_PHOTOS.vegetarian.src,
            imageAlt: FOOD_PHOTOS.vegetarian.alt,
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
                { href: '/info/thai-culture', label: tp('linkCulture') },
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
