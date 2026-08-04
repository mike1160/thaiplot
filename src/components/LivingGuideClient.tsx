'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

const TOPIC_IDS = ['cost', 'taxes', 'banking', 'schools', 'driving'] as const

const OFFICIAL_LINKS = [
  { href: 'https://www.rd.go.th', key: 'revenue' as const },
  { href: 'https://www.bot.or.th', key: 'bot' as const },
  { href: 'https://www.dlt.go.th', key: 'dlt' as const },
  { href: 'https://www.moe.go.th', key: 'moe' as const },
]

function TopicNav({ labels }: { labels: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Topics" className="flex flex-wrap gap-2">
      {labels.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="rounded-[12px] border border-white/70 bg-white/65 px-3.5 py-2 text-sm font-semibold text-[#142038] shadow-[0_6px_18px_rgba(20,32,56,0.05)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#C8973A]/50 hover:text-[#C8973A]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item.slice(0, 48)}>{item}</li>
      ))}
    </ul>
  )
}

function Section({
  id,
  title,
  children,
  lead,
}: {
  id?: string
  title: string
  children: ReactNode
  lead?: string
}) {
  return (
    <section id={id} className="scroll-mt-24 animate-fade-in-up space-y-4">
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

export default function LivingGuideClient({ relatedTitle, relatedLinks }: Props) {
  const t = useTranslations('infoLiving')

  const topicLabels = TOPIC_IDS.map((id) => ({
    id,
    label: t(`topics.${id}.nav`),
  }))

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={HERO_PHOTOS.living}
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

        <aside
          className="relative overflow-hidden rounded-[16px] border border-[#C8973A]/35 bg-gradient-to-br from-[#142038] to-[#243556] px-6 py-7 text-white shadow-[0_20px_48px_rgba(20,32,56,0.25)]"
          role="note"
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(200,151,58,0.55), transparent 70%)',
            }}
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

        <TopicNav labels={topicLabels} />

        <Section title={t('overview.title')}>
          {(t.raw('overview.paras') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        {TOPIC_IDS.map((id) => (
          <Section
            key={id}
            id={id}
            title={t(`topics.${id}.title`)}
            lead={t(`topics.${id}.lead`)}
          >
            {(t.raw(`topics.${id}.paras`) as string[]).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            <BulletList items={t.raw(`topics.${id}.items`) as string[]} />
          </Section>
        ))}

        <Section title={t('budget.title')} lead={t('budget.lead')}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {(t.raw('budget.cards') as { title: string; body: string }[]).map((card) => (
              <li
                key={card.title}
                className="rounded-[14px] border border-white/75 bg-white/70 p-4 shadow-[0_10px_28px_rgba(20,32,56,0.06)] backdrop-blur-md"
              >
                <h3
                  className="mb-1.5 text-base font-bold text-[#142038]"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5C5247]">{card.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('official.title')} lead={t('official.lead')}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {OFFICIAL_LINKS.map((link) => (
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
                  {t(`official.links.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
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
