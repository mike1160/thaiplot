import { getTranslations, setRequestLocale } from 'next-intl/server'
import InfoPageShell from '@/components/InfoPageShell'
import PartnerLinks from '@/components/PartnerLinks'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata, localizedPath } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

const HEALTH_PHOTOS = {
  hero: PEXELS('4386466/pexels-photo-4386466.jpeg', 1400),
  system: PEXELS('247786/pexels-photo-247786.jpeg'),
  costs: PEXELS('4386467/pexels-photo-4386467.jpeg'),
  insuranceLocal: PEXELS('5405596/pexels-photo-5405596.jpeg'),
  insuranceWorld: PEXELS('3943716/pexels-photo-3943716.jpeg'),
  accidents: PEXELS('3806249/pexels-photo-3806249.jpeg'),
  prescriptions: PEXELS('3683098/pexels-photo-3683098.jpeg'),
  otc: PEXELS('5699514/pexels-photo-5699514.jpeg'),
  pharmacies: PEXELS('4226219/pexels-photo-4226219.jpeg'),
} as const

const ALTS = {
  en: {
    hero: 'Doctor consulting patient in modern private hospital Thailand',
    system: 'Modern private hospital exterior Thailand',
    costs: 'Doctor and patient consultation — medical costs Thailand',
    insuranceLocal: 'Insurance documents and travel papers — health insurance Thailand',
    insuranceWorld: 'International health insurance planning online — expat Thailand',
    accidents: 'Motorcycle rider with helmet — accident risk Thailand',
    prescriptions: 'Prescription medication bottles and pills — medicine Thailand',
    otc: 'Pharmacy shelves with over-the-counter medicine Thailand',
    pharmacies: 'Pharmacist behind counter — pharmacy Thailand expats',
  },
  nl: {
    hero: 'Arts en patiënt in modern privéziekenhuis Thailand',
    system: 'Modern privéziekenhuis exterieur Thailand',
    costs: 'Arts en patiënt consult — medische kosten Thailand',
    insuranceLocal: 'Verzekeringsdocumenten — zorgverzekering Thailand',
    insuranceWorld: 'Internationale zorgverzekering online plannen — expat Thailand',
    accidents: 'Motorrijder met helm — verkeersongevallen Thailand',
    prescriptions: 'Receptmedicijnen en pillen — medicatie Thailand',
    otc: 'Apotheekschappen met OTC-producten Thailand',
    pharmacies: 'Apotheker achter toonbank — apotheek Thailand expats',
  },
} as const

function photoAlts(locale: string) {
  return locale === 'nl' ? ALTS.nl : ALTS.en
}

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
    ogImage: `${HEALTH_PHOTOS.hero.replace('w=1400', 'w=1200')}`,
  })
}

export default async function HealthAccidentsPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoHealth')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')
  const faqs = t.raw('faqs') as { q: string; a: string }[]
  const pageUrl = localizedPath(params.locale, '/info/health-accidents-thailand')
  const alts = photoAlts(params.locale)

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
          { name: tb('pages.health') },
        ]}
      />
      <InfoPageShell
        title={t('title')}
        subtitle={t('subtitle')}
        heroImage={HERO_PHOTOS.health}
        heroImageAlt={alts.hero}
        sections={[
          {
            title: t('overview.title'),
            body: <SectionBody paras={t.raw('overview.paras') as string[]} />,
          },
          {
            title: t('system.title'),
            image: HEALTH_PHOTOS.system,
            imageAlt: alts.system,
            body: <SectionBody paras={t.raw('system.paras') as string[]} />,
          },
          {
            title: t('costs.title'),
            image: HEALTH_PHOTOS.costs,
            imageAlt: alts.costs,
            body: (
              <ListBody
                intro={t('costs.intro')}
                items={t.raw('costs.items') as string[]}
              />
            ),
          },
          {
            title: t('insuranceLocal.title'),
            image: HEALTH_PHOTOS.insuranceLocal,
            imageAlt: alts.insuranceLocal,
            body: <SectionBody paras={t.raw('insuranceLocal.paras') as string[]} />,
          },
          {
            title: t('insuranceWorld.title'),
            image: HEALTH_PHOTOS.insuranceWorld,
            imageAlt: alts.insuranceWorld,
            body: <SectionBody paras={t.raw('insuranceWorld.paras') as string[]} />,
          },
          {
            title: t('accidents.title'),
            image: HEALTH_PHOTOS.accidents,
            imageAlt: alts.accidents,
            body: <SectionBody paras={t.raw('accidents.paras') as string[]} />,
          },
          {
            title: t('prescriptions.title'),
            image: HEALTH_PHOTOS.prescriptions,
            imageAlt: alts.prescriptions,
            body: <SectionBody paras={t.raw('prescriptions.paras') as string[]} />,
          },
          {
            title: t('otc.title'),
            image: HEALTH_PHOTOS.otc,
            imageAlt: alts.otc,
            body: (
              <ListBody intro={t('otc.intro')} items={t.raw('otc.items') as string[]} />
            ),
          },
          {
            title: t('pharmacies.title'),
            image: HEALTH_PHOTOS.pharmacies,
            imageAlt: alts.pharmacies,
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
            <PartnerLinks
              title={tp('furtherReadingUpdates')}
              links={[
                {
                  href: 'https://thethaiger.com/expat-guide-thailand',
                  label: tp('thaigerHealthGuide'),
                },
                {
                  href: 'https://thethaiger.com/tag/expats-in-thailand',
                  label: tp('thaigerHealthMoving'),
                },
                {
                  href: 'https://thethaiger.com/travel/thailand-travel/what-expats-in-thailand-wish-they-knew-before-moving-here',
                  label: tp('thaigerHealthWish'),
                },
              ]}
            />
            <RelatedGuides
              title={tp('relatedOnThaiPlot')}
              links={[
                { href: '/info/food-thailand', label: tp('linkFood') },
                { href: '/info/thai-culture', label: tp('linkCulture') },
                { href: '/info/transport-thailand', label: tp('linkTransport') },
                { href: '/info/living-thailand', label: tp('linkLiving') },
                { href: '/info/drinking-water-thailand', label: tp('linkDrinkWater') },
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
