'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import {
  CATEGORY_PHOTOS,
  OFFICIAL_CATEGORIES,
  OFFICIAL_LINKS,
  TH_PL_PHOTOS,
  type OfficialCategoryId,
  type OfficialLinkId,
} from '@/content/official-downloads'

const PLAY_STORE =
  'https://play.google.com/store/apps/details?id=th.go.immigration.thim'
const APP_STORE =
  'https://apps.apple.com/app/thim-thai-immigration-bureau/id6759272559'
const TDAC_URL = 'https://tdac.immigration.go.th'

function CloudFade({
  position,
  fill = '#FAF7F0',
}: {
  position: 'top' | 'bottom'
  fill?: string
}) {
  const flip = position === 'top'
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 z-10 leading-[0] ${
        flip ? 'top-0' : 'bottom-0'
      }`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block w-full h-12 md:h-16 ${flip ? 'rotate-180' : ''}`}
      >
        <path
          fill={fill}
          d="M0,48 C180,78 320,12 480,36 C640,60 780,88 960,40 C1120,4 1280,28 1440,52 L1440,80 L0,80 Z"
        />
        <path
          fill={fill}
          opacity="0.55"
          d="M0,56 C220,20 400,72 560,48 C720,24 900,8 1080,44 C1240,72 1360,60 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

function PhotoBand({
  src,
  title,
  eyebrow,
}: {
  src: string
  title: string
  eyebrow?: string
}) {
  return (
    <div className="relative w-full h-[38vh] min-h-[220px] max-h-[360px] overflow-hidden">
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(20,32,56,0.75) 0%, rgba(20,32,56,0.4) 50%, rgba(20,32,56,0.7) 100%)',
        }}
      />
      <CloudFade position="top" />
      <CloudFade position="bottom" />
      <div className="relative z-[11] h-full flex flex-col justify-center items-center text-center px-6">
        <div className="tp-hero-glass text-center" style={{ maxWidth: '36rem' }}>
          {eyebrow ? (
            <p className="relative z-[1] mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#DBB15A] md:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className="relative z-[1] text-white text-2xl md:text-4xl font-bold"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function OfficialDownloadsClient() {
  const t = useTranslations('infoOfficialDownloads')
  const tp = useTranslations('partnerLinks')

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />

      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={TH_PL_PHOTOS[6]}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-10 md:py-12">
        <div
          className="pointer-events-none absolute inset-x-3 top-4 bottom-4 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.4) 100%)',
          }}
          aria-hidden
        />
        <aside
          className="border border-[#C0392B]/35 bg-[#FFF8F6] px-5 py-5 md:px-7 md:py-6 rounded-[4px]"
          role="note"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#C0392B] mb-2">
            {t('disclaimerLabel')}
          </p>
          <h2
            className="text-xl md:text-2xl font-bold text-[#1A2744] mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('disclaimerTitle')}
          </h2>
          <div className="space-y-2 text-sm md:text-[15px] text-[#5C5247] leading-relaxed">
            {(t.raw('disclaimerParas') as string[]).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </aside>
      </div>

      {/* THIM featured */}
      <div id="thim" className="scroll-mt-20">
      <PhotoBand
        src={TH_PL_PHOTOS[2]}
        eyebrow={t('thim.eyebrow')}
        title={t('thim.title')}
      />
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-12">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <a
              href="https://www.immigration.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-[22%] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8973A] focus-visible:ring-offset-2"
              title={t('thim.officialSiteLink')}
            >
              <img
                src="/thim-app.png"
                alt={t('thim.imageAlt')}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[22%] shadow-[0_8px_28px_rgba(26,39,68,0.18)] object-cover transition-transform hover:scale-[1.03]"
              />
            </a>
            <div className="min-w-0 flex-1 space-y-3 text-sm md:text-[15px] text-[#5C5247] leading-relaxed">
              {(t.raw('thim.intro') as string[]).map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
              <p className="pt-2 text-sm">
                <Link
                  href="/info/thim-app"
                  className="text-[#C8973A] font-semibold hover:underline"
                >
                  {t('thim.fullGuideLink')}
                </Link>
                {' · '}
                <Link
                  href="/info/thailand-digital-arrival-card"
                  className="text-[#C8973A] font-semibold hover:underline"
                >
                  {t('thim.tdacGuideLink')}
                </Link>
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                <a
                  href={PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-btn-primary"
                >
                  {t('thim.android')}
                </a>
                <a
                  href={APP_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-btn-outline"
                >
                  {t('thim.ios')}
                </a>
                <a
                  href={TDAC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-btn-outline-gold"
                >
                  {t('thim.tdacLink')}
                </a>
              </div>
              <p className="text-xs text-[#8A7F72] pt-1">{t('thim.storeNote')}</p>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
            <img
              src="/THIM-APP-2.png"
              alt={t('thim.imageAlt2')}
              className="w-full rounded-2xl shadow-[0_12px_40px_rgba(26,39,68,0.16)] object-cover"
            />
            <figcaption className="mt-3 text-center text-xs text-[#8A7F72]">
              {t('thim.imageCaption2')}
            </figcaption>
          </figure>
        </div>

        <ThimSection title={t('thim.whatTitle')}>
          {(t.raw('thim.whatParas') as string[]).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </ThimSection>

        <ThimSection title={t('thim.compareTitle')}>
          <p className="mb-4">{t('thim.compareIntro')}</p>
          <div className="overflow-x-auto border border-[#E8E2D6] bg-white">
            <table className="w-full text-sm text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-[#1A2744] text-white">
                  <th className="px-3 py-2.5 font-semibold">{t('thim.table.topic')}</th>
                  <th className="px-3 py-2.5 font-semibold">TDAC</th>
                  <th className="px-3 py-2.5 font-semibold">THIM</th>
                </tr>
              </thead>
              <tbody>
                {(t.raw('thim.table.rows') as { topic: string; tdac: string; thim: string }[]).map(
                  (row, i) => (
                    <tr
                      key={row.topic}
                      className={i % 2 === 1 ? 'bg-[#FAF7F0]' : 'bg-white'}
                    >
                      <td className="px-3 py-2.5 font-medium text-[#1A2744] align-top border-t border-[#E8E2D6]">
                        {row.topic}
                      </td>
                      <td className="px-3 py-2.5 align-top border-t border-[#E8E2D6]">{row.tdac}</td>
                      <td className="px-3 py-2.5 align-top border-t border-[#E8E2D6]">{row.thim}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[#C0392B] font-medium">{t('thim.scamWarning')}</p>
        </ThimSection>

        <ThimSection title={t('thim.featuresTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('thim.features') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </ThimSection>

        <ThimSection title={t('thim.howtoTitle')}>
          {(t.raw('thim.howtoParas') as string[]).map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </ThimSection>

        <ThimSection title={t('thim.tipsTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('thim.tips') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </ThimSection>

        <ThimSection title={t('thim.downloadTitle')}>
          <ol className="list-decimal pl-5 space-y-1.5">
            {(t.raw('thim.downloadSteps') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ol>
          <p className="mt-3">{t('thim.downloadNote')}</p>
        </ThimSection>

        <ThimSection title={t('thim.nextTitle')}>
          <p className="mb-3">{t('thim.nextIntro')}</p>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('thim.nextItems') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </ThimSection>

        <ThimSection title={t('thim.beforeTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('thim.beforeItems') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-[#1A2744] font-medium">{t('thim.note')}</p>
        </ThimSection>
      </div>
      </div>

      {OFFICIAL_CATEGORIES.map((cat) => (
        <CategoryBlock key={cat} category={cat} />
      ))}

      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-10">
        <section>
          <h2 className="tp-section-title mb-3">{t('howToTitle')}</h2>
          <ul className="space-y-2 text-sm md:text-[15px] text-[#5C5247] leading-relaxed list-disc pl-5">
            {(t.raw('howToItems') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </section>

        <RelatedGuides
          title={tp('relatedOnThaiPlot')}
          links={[
            { href: '/info/thim-app', label: tp('linkThim') },
            { href: '/info/thailand-digital-arrival-card', label: tp('linkTdac') },
            { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
            { href: '/info/health-accidents-thailand', label: tp('linkHealth') },
            { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          ]}
        />

        <div className="pt-4 border-t border-[#E8E2D6]">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}

function ThimSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="tp-section-title text-lg md:text-xl">{title}</h3>
      <div className="tp-body space-y-3">{children}</div>
    </section>
  )
}

function CategoryBlock({ category }: { category: OfficialCategoryId }) {
  const t = useTranslations('infoOfficialDownloads')
  const links = OFFICIAL_LINKS.filter((l) => l.category === category)
  const photo = TH_PL_PHOTOS[CATEGORY_PHOTOS[category]]

  return (
    <section>
      <PhotoBand src={photo} title={t(`categories.${category}.title`)} />
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-10">
        <p className="text-sm md:text-[15px] text-[#5C5247] mb-6 leading-relaxed">
          {t(`categories.${category}.intro`)}
        </p>
        <ul className="space-y-3">
          {links.map((link) => (
            <LinkRow key={link.id} id={link.id} href={link.href} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function LinkRow({ id, href }: { id: OfficialLinkId; href: string | null }) {
  const t = useTranslations('infoOfficialDownloads')
  const isPlaceholder = !href

  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-[#1A2744] text-sm md:text-[15px]">
            {t(`links.${id}.name`)}
          </span>
          {isPlaceholder ? (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#E8E2D6] text-[#5C5247]">
              {t('placeholderBadge')}
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#1A2744]/8 text-[#1A2744]">
              {t('officialBadge')}
            </span>
          )}
        </div>
        <p className="text-sm text-[#5C5247] leading-snug">{t(`links.${id}.desc`)}</p>
        {isPlaceholder ? (
          <p className="mt-1.5 text-xs text-[#8A7F72] font-mono">{t('placeholderUrl')}</p>
        ) : (
          <p className="mt-1.5 text-xs text-[#8A7F72] font-mono truncate">{href}</p>
        )}
      </div>
      <span
        className={`flex-shrink-0 text-sm font-semibold ${
          isPlaceholder ? 'text-[#8A7F72]' : 'text-[#C8973A]'
        }`}
      >
        {isPlaceholder ? t('comingSoon') : t('openLink')}
      </span>
    </>
  )

  if (isPlaceholder) {
    return (
      <li className="flex items-center gap-4 border border-[#E8E2D6] bg-white/60 px-4 py-3.5 opacity-90">
        {inner}
      </li>
    )
  }

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 border border-[#E8E2D6] bg-white px-4 py-3.5 transition-colors hover:border-[#C8973A]/60 hover:bg-white"
      >
        {inner}
      </a>
    </li>
  )
}
