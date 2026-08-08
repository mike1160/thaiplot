import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import InfoPageShell from '@/components/InfoPageShell'
import RelatedGuides from '@/components/RelatedGuides'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/SeoJsonLd'
import { buildPageMetadata } from '@/lib/seo'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type Props = { params: { locale: string } }

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

const PHOTOS = {
  hero: HERO_PHOTOS.retirementRanking,
  beach: PEXELS('1174732/pexels-photo-1174732.jpeg'),
  hospital: PEXELS('247786/pexels-photo-247786.jpeg'),
  villa: PEXELS('261327/pexels-photo-261327.jpeg'),
  pool: PEXELS('189296/pexels-photo-189296.jpeg'),
} as const

const RANKING: Array<{
  rank: number
  flag: string
  country: string
  highlight?: boolean
}> = [
  { rank: 1, flag: '🇲🇾', country: 'Malaysia' },
  { rank: 2, flag: '🇵🇦', country: 'Panama' },
  { rank: 3, flag: '🇵🇹', country: 'Portugal' },
  { rank: 4, flag: '🇹🇭', country: 'Thailand ✦', highlight: true },
  { rank: 5, flag: '🇲🇽', country: 'Mexico' },
]

const SCORES = [
  { value: '96', label: 'Cost of Living' },
  { value: '84', label: 'Development & Governance' },
  { value: '79', label: 'Healthcare' },
  { value: '79', label: 'Visa & Retiree Benefits' },
  { value: '80', label: 'Overall Score / 100' },
] as const

export async function generateMetadata({ params }: Props) {
  return buildPageMetadata({
    locale: params.locale,
    namespace: 'infoRetirementRanking',
    path: '/info/thailand-retirement-ranking-2026',
    ogImage: PEXELS('1174732/pexels-photo-1174732.jpeg', 1200),
  })
}

export default async function ThailandRetirementRankingPage({ params }: Props) {
  setRequestLocale(params.locale)
  const t = await getTranslations('infoRetirementRanking')
  const tp = await getTranslations('partnerLinks')
  const tb = await getTranslations('breadcrumb')

  return (
    <>
      <ArticleJsonLd
        locale={params.locale}
        path="/info/thailand-retirement-ranking-2026"
        title={t('metaTitle')}
        description={t('metaDescription')}
        image={PHOTOS.hero}
      />
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[
          { name: tb('home'), path: '/' },
          { name: tb('pages.retirementRanking') },
        ]}
      />
      <InfoPageShell
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        heroImage={PHOTOS.hero}
        heroImageAlt="Beach coastline in Thailand — popular retirement destination"
        sections={[
          {
            title: t('intro.title'),
            body: (
              <>
                <div className="mb-8 overflow-hidden rounded-[12px] bg-[#1A2744] px-6 py-10 text-center text-white shadow-[0_16px_40px_rgba(20,32,56,0.12)]">
                  <p
                    className="text-6xl font-bold leading-none tracking-tight md:text-8xl"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    #4
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 md:text-xs">
                    {t('heroStat.label')}
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-sm text-white/80 md:text-base">
                    {t('heroStat.sub')}
                  </p>
                </div>
                <p className="mb-6 text-[13px] text-[#5C5247]">
                  {t('meta')}
                </p>
                <p>{t('intro.p1')}</p>
                <p>
                  {t.rich('intro.p2', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="my-8 rounded-[12px] border border-[#E8E2D6] border-l-[3px] border-l-[#C8973A] bg-[#FAF7F0] p-5 md:p-6">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C8973A]">
                    {t('ranking.title')}
                  </p>
                  <div className="space-y-0">
                    {RANKING.map((row) => (
                      <div
                        key={row.rank}
                        className={`flex items-center gap-3.5 border-b border-black/[0.07] py-2.5 last:border-b-0 ${
                          row.highlight ? 'font-semibold' : ''
                        }`}
                      >
                        <span
                          className={`min-w-[2rem] text-xl font-semibold ${
                            row.highlight ? 'text-[#2e6b4f]' : 'text-[#C8973A]'
                          }`}
                          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                        >
                          {row.rank}
                        </span>
                        <span className="text-xl" aria-hidden>
                          {row.flag}
                        </span>
                        <span
                          className={`text-[15px] ${
                            row.highlight ? 'text-[#2e6b4f]' : 'text-[#1A2744]'
                          }`}
                        >
                          {row.country}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ),
          },
          {
            title: t('threeLists.title'),
            image: PHOTOS.beach,
            imageAlt: 'Hua Hin beach Thailand — retirement lifestyle on the Gulf coast',
            body: (
              <>
                <p>{t('threeLists.intro')}</p>
                <ul className="mb-3 list-disc space-y-2 pl-5">
                  <li>
                    {t.rich('threeLists.item1', {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    {t.rich('threeLists.item2', {
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </li>
                  <li>
                    {t.rich('threeLists.item3', {
                      strong: (chunks) => <strong>{chunks}</strong>,
                      em: (chunks) => <em>{chunks}</em>,
                    })}
                  </li>
                </ul>
                <p>{t('threeLists.outro')}</p>
              </>
            ),
          },
          {
            title: t('numbers.title'),
            image: PHOTOS.hospital,
            imageAlt: 'Modern private hospital Thailand — healthcare for retirees',
            body: (
              <>
                <p>{t('numbers.intro')}</p>
                <div className="my-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SCORES.map((score) => (
                    <div
                      key={score.label}
                      className="rounded-[10px] bg-[#eaf3ee] p-4"
                    >
                      <p
                        className="text-3xl font-semibold leading-none text-[#2e6b4f]"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                      >
                        {score.value}
                      </p>
                      <p className="mt-1.5 text-xs text-[#5C5247]">{score.label}</p>
                    </div>
                  ))}
                </div>
                <p>
                  {t.rich('numbers.p1', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>{t('numbers.p2')}</p>
              </>
            ),
          },
          {
            title: t('caveats.title'),
            body: (
              <>
                <p>
                  {t.rich('caveats.intro', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="my-7 rounded-[12px] border border-[#E8E2D6] bg-[#fafaf8] p-5 md:p-6">
                  <p className="mb-3 text-sm font-semibold text-[#1A2744]">
                    {t('caveats.calloutTitle')}
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-[15px] text-[#5C5247]">
                    <li>{t('caveats.item1')}</li>
                    <li>
                      {t.rich('caveats.item2', {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </li>
                    <li>{t('caveats.item3')}</li>
                    <li>{t('caveats.item4')}</li>
                  </ul>
                </div>
              </>
            ),
          },
          {
            title: t('huaHin.title'),
            image: PHOTOS.villa,
            imageAlt: 'Thailand villa with swimming pool — Hua Hin Pranburi lifestyle',
            body: (
              <>
                <p>{t('huaHin.p1')}</p>
                <figure className="my-6 overflow-hidden rounded-[8px] border border-white/70 bg-white/40 shadow-[0_16px_40px_rgba(20,32,56,0.1)]">
                  <img
                    src={PHOTOS.pool}
                    alt="Infinity pool villa overlooking tropical landscape Thailand"
                    loading="lazy"
                    className="h-[200px] w-full object-cover sm:h-[260px]"
                  />
                </figure>
                <p>{t('huaHin.p2')}</p>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[12px] bg-[#1A2744] px-6 py-8 text-white shadow-[0_16px_40px_rgba(20,32,56,0.12)]">
                  <div className="max-w-md">
                    <p
                      className="mb-1 text-xl font-semibold"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {t('cta.title')}
                    </p>
                    <p className="text-sm text-white/70">{t('cta.text')}</p>
                  </div>
                  <Link
                    href="/listings"
                    className="inline-flex whitespace-nowrap rounded-[8px] bg-[#C8973A] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {t('cta.button')}
                  </Link>
                </div>
              </>
            ),
          },
          {
            title: t('bottomLine.title'),
            body: (
              <>
                <p>{t('bottomLine.p1')}</p>
                <p>{t('bottomLine.p2')}</p>
                <p className="italic text-[#5C5247]">{t('bottomLine.note')}</p>
                <div className="mt-10 border-t border-[#E8E2D6] pt-6 text-[13px] leading-relaxed text-[#5C5247]">
                  <p>
                    <strong>{t('sources.label')}</strong> {t('sources.text')}
                  </p>
                  <p className="mt-3">
                    {t('sources.disclaimer')}{' '}
                    <Link
                      href="/legal/disclaimer"
                      className="text-[#A67B2E] underline underline-offset-2 transition-colors hover:text-[#8F6826]"
                    >
                      {t('sources.disclaimerLink')}
                    </Link>
                  </p>
                </div>
              </>
            ),
          },
        ]}
        bottomSlot={
          <RelatedGuides
            title={tp('relatedOnThaiPlot')}
            links={[
              { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
              { href: '/info/living-thailand', label: tp('linkLiving') },
              { href: '/info/buying-land-thailand', label: tp('linkBuying') },
              { href: '/info/hua-hin-property-market', label: tp('linkHuaHin') },
              { href: '/info/pranburi-property', label: tp('linkPranburi') },
              { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
            ]}
          />
        }
      />
    </>
  )
}
