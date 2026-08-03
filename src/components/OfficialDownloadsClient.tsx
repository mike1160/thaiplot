'use client'

import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import {
  CATEGORY_PHOTOS,
  OFFICIAL_CATEGORIES,
  OFFICIAL_LINKS,
  TH_PL_PHOTOS,
  type OfficialCategoryId,
  type OfficialLinkId,
} from '@/content/official-downloads'

export default function OfficialDownloadsClient() {
  const t = useTranslations('infoOfficialDownloads')

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />

      <section className="relative min-h-[52vh] flex items-end overflow-hidden">
        <img
          src={TH_PL_PHOTOS[6]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(26,39,68,0.92) 0%, rgba(26,39,68,0.45) 55%, rgba(26,39,68,0.25) 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-14 pt-28">
          <p className="text-[#C8973A] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-3">
            {t('eyebrow')}
          </p>
          <h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-14">
        {/* Disclaimer */}
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

        {/* Photo strip */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <div key={n} className="relative aspect-[3/4] overflow-hidden bg-[#E8E2D6]">
              <img
                src={TH_PL_PHOTOS[n]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#5C5247] -mt-8">{t('photoCaption')}</p>

        {/* Categories */}
        {OFFICIAL_CATEGORIES.map((cat) => (
          <CategoryBlock key={cat} category={cat} />
        ))}

        <section className="border-t border-[#E8E2D6] pt-10">
          <h2
            className="text-xl md:text-2xl font-bold mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('howToTitle')}
          </h2>
          <ul className="space-y-2 text-sm md:text-[15px] text-[#5C5247] leading-relaxed list-disc pl-5">
            {(t.raw('howToItems') as string[]).map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="pt-4 border-t border-[#E8E2D6]">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}

function CategoryBlock({ category }: { category: OfficialCategoryId }) {
  const t = useTranslations('infoOfficialDownloads')
  const links = OFFICIAL_LINKS.filter((l) => l.category === category)
  const photo = TH_PL_PHOTOS[CATEGORY_PHOTOS[category]]

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-5 md:gap-8 items-start">
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[160px] overflow-hidden bg-[#E8E2D6]">
          <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-[#1A2744] mb-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t(`categories.${category}.title`)}
          </h2>
          <p className="text-sm text-[#5C5247] mb-5 leading-relaxed">
            {t(`categories.${category}.intro`)}
          </p>
          <ul className="space-y-3">
            {links.map((link) => (
              <LinkRow key={link.id} id={link.id} href={link.href} />
            ))}
          </ul>
        </div>
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
