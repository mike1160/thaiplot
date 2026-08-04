'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

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
    <ul className="space-y-4">
      {islands.map((island) => (
        <li
          key={island.name}
          className="rounded-[14px] border border-white/75 bg-white/70 p-4 shadow-[0_10px_28px_rgba(20,32,56,0.06)] backdrop-blur-md md:p-5"
        >
          <h3
            className="mb-2 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {island.name}
          </h3>
          <p className="mb-2 text-sm leading-relaxed text-[#5C5247] md:text-[15px]">
            {island.body}
          </p>
          <p className="text-sm font-medium text-[#C8973A]">{island.how}</p>
        </li>
      ))}
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

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={HERO_PHOTOS.islands}
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

        <section className="tp-body space-y-3">
          <p>{(t.raw('intro') as string[])[0]}</p>
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
        </section>

        <Section title={t('gulf.title')} lead={t('gulf.lead')}>
          <IslandCards islands={gulfIslands} />
        </Section>

        <Section title={t('andaman.title')} lead={t('andaman.lead')}>
          <IslandCards islands={andamanIslands} />
        </Section>

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
                  <tr
                    key={row[0]}
                    className="border-t border-[#E8E2D6] odd:bg-white/70 even:bg-[#FAF7F0]/80"
                  >
                    {row.map((cell) => (
                      <td key={cell} className="px-3 py-2.5 text-[#5C5247]">
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
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('diving.marine.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('tips.title')}>
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
