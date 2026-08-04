'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

const ISLAND_PHOTOS: Record<string, { src: string; alt: string }> = {
  'Koh Samui': {
    src: PEXELS('5567082/pexels-photo-5567082.jpeg'),
    alt: 'Tropical coastline of Koh Samui, Thailand',
  },
  'Koh Phangan': {
    src: PEXELS('4206645/pexels-photo-4206645.jpeg'),
    alt: 'Beach in Koh Phangan, Gulf of Thailand',
  },
  'Koh Tao': {
    src: PEXELS('37914438/pexels-photo-37914438.jpeg'),
    alt: 'Aerial view of Koh Tao island at sunset, Thailand',
  },
  'Koh Chang': {
    src: PEXELS('15249164/pexels-photo-15249164.jpeg'),
    alt: 'Tropical beach with palm trees, Koh Chang Thailand',
  },
  'Koh Kood & Koh Mak': {
    src: PEXELS('13162586/pexels-photo-13162586.jpeg'),
    alt: 'Secluded beach with coconut palms, eastern Gulf Thailand',
  },
  Phuket: {
    src: PEXELS('14512239/pexels-photo-14512239.jpeg'),
    alt: 'Aerial coastal view of Phuket, Thailand',
  },
  'Koh Phi Phi': {
    src: PEXELS('33782657/pexels-photo-33782657.jpeg'),
    alt: 'Limestone cliffs and turquoise water, Koh Phi Phi Thailand',
  },
  'Koh Lanta': {
    src: PEXELS('12932889/pexels-photo-12932889.jpeg'),
    alt: 'Peaceful coastline of Koh Lanta, Andaman Sea Thailand',
  },
  'Koh Lipe': {
    src: PEXELS('6010843/pexels-photo-6010843.jpeg'),
    alt: 'Boats on turquoise water, Koh Lipe Thailand',
  },
  'Similan Islands': {
    src: PEXELS('33240623/pexels-photo-33240623.jpeg'),
    alt: 'Crystal clear lagoon, Similan Islands Thailand',
  },
}

const INTRO_MAP = PEXELS('3889843/pexels-photo-3889843.jpeg', 600)
const DIVING_PHOTO = PEXELS('3369569/pexels-photo-3369569.jpeg', 1400)
const TIPS_PHOTO = PEXELS('33948713/pexels-photo-33948713.jpeg')

const MARINE_EMOJIS = ['🐢', '🦈', '🐠', '🦈', '🐡'] as const

function seasonCellClass(cell: string, colIndex: number): string {
  if (colIndex === 0) return 'px-3 py-2.5 text-[#5C5247]'
  const lower = cell.toLowerCase()
  const caution =
    /cancel|closed|rough|gesloten|annul|ruwer|june–sept|juni–sept|may–october|mei–oktober/.test(
      lower
    )
  const good =
    /november|year-round|heel jaar|feb|february|april|best/.test(lower) && !caution
  if (caution) return 'px-3 py-2.5 text-[#5C5247] bg-[#fff3e0]'
  if (good) return 'px-3 py-2.5 text-[#5C5247] bg-[#e8f5e9]'
  return 'px-3 py-2.5 text-[#5C5247]'
}

function Section({
  title,
  children,
  lead,
}: {
  title: string
  children: ReactNode
  lead?: string
}) {
  return (
    <section className="animate-fade-in-up space-y-4">
      <h2 className="tp-section-title">{title}</h2>
      {lead ? <p className="tp-body px-0.5">{lead}</p> : null}
      <div className="tp-body space-y-3 px-0.5">{children}</div>
    </section>
  )
}

function IslandCards({
  islands,
}: {
  islands: { name: string; body: string; how: string }[]
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {islands.map((island) => {
        const photo = ISLAND_PHOTOS[island.name]
        return (
          <li
            key={island.name}
            className="overflow-hidden rounded-[10px] border border-[#E8E2D6] bg-white/80 shadow-[0_10px_28px_rgba(20,32,56,0.06)]"
          >
            {photo ? (
              <img
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={260}
                loading="lazy"
                className="h-[260px] w-full object-cover"
              />
            ) : null}
            <div className="p-4 md:p-5">
              <h3
                className="mb-2 text-lg font-bold text-[#142038]"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {island.name}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-[#5C5247] md:text-[15px]">
                {island.body}
              </p>
              <span className="inline-block rounded-[8px] border border-[#C8973A]/35 bg-[#FAF7F0] px-2.5 py-1 text-xs font-medium text-[#8B6914]">
                {island.how}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

type Props = {
  relatedTitle: string
  relatedLinks: { href: string; label: string }[]
}

export default function IslandsGuideClient({ relatedTitle, relatedLinks }: Props) {
  const t = useTranslations('infoIslands')
  const gulfIslands = t.raw('gulf.islands') as { name: string; body: string; how: string }[]
  const andamanIslands = t.raw('andaman.islands') as {
    name: string
    body: string
    how: string
  }[]
  const introParas = t.raw('intro') as string[]

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={HERO_PHOTOS.islands}
        imageAlt="Aerial view of Koh Phi Phi Islands, Thailand"
        size="main"
      />

      <article className="relative mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-x-3 top-6 bottom-6 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.45) 100%)',
          }}
          aria-hidden
        />

        <section className="tp-body space-y-5">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <div className="space-y-3">
              {introParas.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <p>
                {t('transportLinkBefore')}{' '}
                <Link
                  href="/info/transport-thailand"
                  className="font-semibold text-[#C8973A] underline-offset-2 hover:underline"
                >
                  {t('transportLinkLabel')}
                </Link>
                .
              </p>
            </div>
            <img
              src={INTRO_MAP}
              alt="Thailand coastlines map"
              width={600}
              height={400}
              loading="lazy"
              className="h-full max-h-[280px] w-full rounded-[8px] object-cover shadow-[0_10px_28px_rgba(20,32,56,0.08)] md:max-h-none"
            />
          </div>
        </section>

        <Section title={t('gulf.title')} lead={t('gulf.lead')}>
          <IslandCards islands={gulfIslands} />
        </Section>

        <Section title={t('andaman.title')} lead={t('andaman.lead')}>
          <IslandCards islands={andamanIslands} />
        </Section>

        <div className="animate-fade-in-up">
          <img
            src={DIVING_PHOTO}
            alt="Coral reef underwater Thailand"
            width={1400}
            height={340}
            loading="lazy"
            className="mb-6 h-[340px] w-full rounded-[8px] object-cover"
          />
        </div>

        <Section title={t('diving.title')} lead={t('diving.lead')}>
          <h3
            className="text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('diving.beginners.title')}
          </h3>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('diving.beginners.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>

          <h3
            className="pt-4 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('diving.experienced.title')}
          </h3>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('diving.experienced.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>

          <h3
            className="pt-4 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('diving.snorkel.title')}
          </h3>
          <p>{t('diving.snorkel.body')}</p>

          <h3
            className="pt-4 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('diving.seasons.title')}
          </h3>
          <div className="overflow-x-auto rounded-[12px] border border-[#E8E2D6]">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-[#142038] text-white">
                <tr>
                  {(t.raw('diving.seasons.headers') as string[]).map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(t.raw('diving.seasons.rows') as string[][]).map((row) => (
                  <tr key={row[0]} className="border-t border-[#E8E2D6]">
                    {row.map((cell, colIndex) => (
                      <td key={`${row[0]}-${colIndex}`} className={seasonCellClass(cell, colIndex)}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3
            className="pt-4 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('diving.marine.title')}
          </h3>
          <ul className="space-y-2 pl-0">
            {(t.raw('diving.marine.items') as string[]).map((item, i) => (
              <li key={item.slice(0, 40)} className="flex gap-2.5 text-[#5C5247]">
                <span className="flex-shrink-0 text-lg leading-none" aria-hidden>
                  {MARINE_EMOJIS[i] ?? '🐟'}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('tips.title')}>
          <img
            src={TIPS_PHOTO}
            alt="Hillside coastline view Koh Samui Thailand"
            width={900}
            height={320}
            loading="lazy"
            className="mb-4 h-[320px] w-full rounded-[8px] object-cover"
          />
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('tips.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('booking.title')}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {(t.raw('booking.links') as { href: string; label: string }[]).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tp-link-card"
                >
                  <span className="text-[#C8973A]" aria-hidden>
                    →
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('faqTitle')}>
          <dl className="space-y-5">
            {(t.raw('faqs') as { q: string; a: string }[]).map((faq) => (
              <div key={faq.q}>
                <dt className="mb-1 font-semibold text-[#142038]">{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <p className="border-l-2 border-[#C8973A] pl-4 text-sm leading-relaxed text-[#5C5247]">
          {t('disclaimer')}
        </p>

        <RelatedGuides title={relatedTitle} links={relatedLinks} />

        <div className="border-t border-[#E8E2D6]/90 pt-6">
          <DisclaimerFooter />
        </div>
      </article>
    </main>
  )
}
