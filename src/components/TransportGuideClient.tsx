'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

type ModeCard = {
  id: string
  accent?: string
}

const ROAD_MODES: ModeCard[] = [
  { id: 'car', accent: '#1A2744' },
  { id: 'motorcycle', accent: '#C0392B' },
  { id: 'scooter', accent: '#C8973A' },
  { id: 'taxi', accent: '#DBB15A' },
  { id: 'grabBolt', accent: '#00B14F' },
  { id: 'minivan', accent: '#243556' },
  { id: 'bus', accent: '#5C5247' },
]

const RAIL_MODES: ModeCard[] = [
  { id: 'train', accent: '#1A2744' },
  { id: 'bts', accent: '#C8973A' },
  { id: 'metro', accent: '#243556' },
]

const AIR_MODES: ModeCard[] = [
  { id: 'domestic', accent: '#1A2744' },
  { id: 'terminals', accent: '#C8973A' },
]

const WATER_MODES: ModeCard[] = [
  { id: 'boats', accent: '#1A2744' },
  { id: 'ferries', accent: '#C8973A' },
]

const BOOKING_LINKS = [
  { href: 'https://12go.asia', key: 'twelveGo' as const },
  { href: 'https://www.grab.com/th/en/', key: 'grab' as const },
  { href: 'https://bolt.eu/en-th/', key: 'bolt' as const },
  { href: 'https://www.railway.co.th/Home/Index', key: 'srt' as const },
  { href: 'https://www.bts.co.th/eng/index.html', key: 'btsSite' as const },
  { href: 'https://metro.bemplc.co.th/', key: 'mrtSite' as const },
  { href: 'https://www.airasia.com', key: 'airasia' as const },
  { href: 'https://www.thaiairways.com', key: 'thaiAirways' as const },
  { href: 'https://www.bangkokair.com', key: 'bangkokAir' as const },
  { href: 'https://www.nokair.com', key: 'nokAir' as const },
  { href: 'https://www.skyscanner.net', key: 'skyscanner' as const },
  { href: 'https://www.google.com/travel/flights', key: 'googleFlights' as const },
  { href: 'https://www.rome2rio.com', key: 'rome2rio' as const },
]

function ModeGrid({
  modes,
  titleOf,
  bodyOf,
}: {
  modes: ModeCard[]
  titleOf: (id: string) => string
  bodyOf: (id: string) => string
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {modes.map((mode, i) => (
        <li
          key={mode.id}
          className="group relative overflow-hidden rounded-[14px] border border-white/75 bg-white/70 p-4 shadow-[0_10px_28px_rgba(20,32,56,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,32,56,0.12)] animate-fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span
            className="absolute left-0 top-0 h-full w-[3px]"
            style={{ background: mode.accent || '#C8973A' }}
            aria-hidden
          />
          <h3
            className="mb-1.5 pl-2 text-base font-bold text-[#142038] md:text-lg"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {titleOf(mode.id)}
          </h3>
          <p className="pl-2 text-sm leading-relaxed text-[#5C5247]">{bodyOf(mode.id)}</p>
        </li>
      ))}
    </ul>
  )
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

type Props = {
  relatedTitle: string
  relatedLinks: { href: string; label: string }[]
}

export default function TransportGuideClient({ relatedTitle, relatedLinks }: Props) {
  const t = useTranslations('infoTransport')

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={HERO_PHOTOS.transport}
        size="main"
      />

      <article className="relative mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-x-3 top-6 bottom-6 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.45) 100%)',
            boxShadow: '0 20px 60px rgba(20,32,56,0.05)',
          }}
          aria-hidden
        />

        {/* Pull quote / candy hook */}
        <aside
          className="relative overflow-hidden rounded-[16px] border border-[#C8973A]/35 bg-gradient-to-br from-[#142038] to-[#243556] px-6 py-7 text-white shadow-[0_20px_48px_rgba(20,32,56,0.25)]"
          role="note"
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(200,151,58,0.55), transparent 70%)' }}
            aria-hidden
          />
          <p className="relative z-[1] text-[11px] font-semibold uppercase tracking-[0.28em] text-[#DBB15A]">
            {t('hook.eyebrow')}
          </p>
          <p
            className="relative z-[1] mt-2 text-xl font-bold leading-snug md:text-2xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('hook.title')}
          </p>
          <p className="relative z-[1] mt-3 text-sm leading-relaxed md:text-[15px] tp-hero-subtitle">
            {t('hook.body')}
          </p>
        </aside>

        <Section title={t('overview.title')}>
          {(t.raw('overview.paras') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('mortality.title')} lead={t('mortality.lead')}>
          {(t.raw('mortality.paras') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {(t.raw('mortality.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('traffic.title')} lead={t('traffic.lead')}>
          {(t.raw('traffic.paras') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('road.title')} lead={t('road.lead')}>
          <ModeGrid
            modes={ROAD_MODES}
            titleOf={(id) => t(`modes.${id}.title`)}
            bodyOf={(id) => t(`modes.${id}.body`)}
          />
        </Section>

        <Section title={t('rail.title')} lead={t('rail.lead')}>
          <ModeGrid
            modes={RAIL_MODES}
            titleOf={(id) => t(`modes.${id}.title`)}
            bodyOf={(id) => t(`modes.${id}.body`)}
          />
        </Section>

        <Section title={t('air.title')} lead={t('air.lead')}>
          <ModeGrid
            modes={AIR_MODES}
            titleOf={(id) => t(`modes.${id}.title`)}
            bodyOf={(id) => t(`modes.${id}.body`)}
          />
        </Section>

        <Section title={t('water.title')} lead={t('water.lead')}>
          <ModeGrid
            modes={WATER_MODES}
            titleOf={(id) => t(`modes.${id}.title`)}
            bodyOf={(id) => t(`modes.${id}.body`)}
          />
        </Section>

        <Section title={t('booking.title')} lead={t('booking.lead')}>
          <div className="rounded-[14px] border border-amber-600/30 bg-[#FFF8F0]/90 px-4 py-3 text-sm text-[#5C5247]">
            {t('booking.note')}
          </div>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {BOOKING_LINKS.map((link) => (
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
                  {t(`booking.links.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#5C5247]">{t('booking.footer')}</p>
        </Section>

        <Section title={t('checklist.title')}>
          <ol className="list-decimal space-y-2 pl-5">
            {(t.raw('checklist.items') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ol>
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
