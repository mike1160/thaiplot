'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { HERO_PHOTOS } from '@/lib/hero-photos'

const PEXELS = (id: string, w = 900) =>
  `https://images.pexels.com/photos/${id}?auto=compress&cs=tinysrgb&w=${w}`

const SECTION_PHOTOS = {
  myths: {
    src: PEXELS('3225517/pexels-photo-3225517.jpeg'),
    alt: 'Busy Bangkok street Thailand',
  },
  wai: {
    src: PEXELS('3155666/pexels-photo-3155666.jpeg'),
    alt: 'Thai people greeting Thailand',
  },
  royal: {
    src: PEXELS('2614818/pexels-photo-2614818.jpeg'),
    alt: 'Thai flag official Thailand',
  },
  face: {
    src: PEXELS('3184291/pexels-photo-3184291.jpeg'),
    alt: 'People in conversation Thailand',
  },
  sanuk: {
    src: PEXELS('2403392/pexels-photo-2403392.jpeg'),
    alt: 'Bangkok street market Thailand',
  },
  temples: {
    src: PEXELS('1586298/pexels-photo-1586298.jpeg'),
    alt: 'Thai temple Buddha Thailand',
  },
  modern: {
    src: PEXELS('3769138/pexels-photo-3769138.jpeg'),
    alt: 'Modern Bangkok urban life Thailand',
  },
  eating: {
    src: PEXELS('1640774/pexels-photo-1640774.jpeg'),
    alt: 'Thai food shared meal Thailand',
  },
  contrast: {
    src: PEXELS('2356045/pexels-photo-2356045.jpeg'),
    alt: 'Temple and modern Bangkok Thailand',
  },
} as const

function SectionPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={900}
      height={260}
      loading="lazy"
      className="mb-6 h-[260px] w-full rounded-[8px] object-cover"
    />
  )
}

function Section({
  title,
  children,
  lead,
  photo,
}: {
  title: string
  children: ReactNode
  lead?: string
  photo?: { src: string; alt: string }
}) {
  return (
    <section className="animate-fade-in-up space-y-4">
      <h2 className="tp-section-title">{title}</h2>
      {photo ? <SectionPhoto src={photo.src} alt={photo.alt} /> : null}
      {lead ? <p className="tp-body px-0.5">{lead}</p> : null}
      <div className="tp-body space-y-3 px-0.5">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item) => (
        <li key={item.slice(0, 48)}>{item}</li>
      ))}
    </ul>
  )
}

type Props = {
  relatedTitle: string
  relatedLinks: { href: string; label: string }[]
}

export default function CultureGuideClient({ relatedTitle, relatedLinks }: Props) {
  const t = useTranslations('infoCulture')

  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={HERO_PHOTOS.culture}
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
          {(t.raw('intro') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>

        <Section title={t('myths.title')} lead={t('myths.lead')} photo={SECTION_PHOTOS.myths}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {(t.raw('myths.items') as { title: string; body: string }[]).map((item) => (
              <li
                key={item.title}
                className="rounded-[8px] bg-[#f8f8f8] p-5"
              >
                <span className="mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wider text-white bg-[#c62828]">
                  MYTHE
                </span>
                <h3 className="mb-1.5 text-base font-bold text-[#142038] md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5C5247] md:text-[15px]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('wai.title')} lead={t('wai.lead')} photo={SECTION_PHOTOS.wai}>
          <div
            className="rounded-[6px] p-4"
            style={{
              background: '#f0f4ff',
              borderLeft: '3px solid #3f51b5',
            }}
          >
            <p className="mb-2 font-semibold text-[#142038]">{t('wai.practiceTitle')}</p>
            <BulletList items={t.raw('wai.items') as string[]} />
          </div>
          <p>{t('wai.note')}</p>
        </Section>

        <Section title={t('royal.title')} lead={t('royal.lead')} photo={SECTION_PHOTOS.royal}>
          <div
            className="rounded-[6px] px-5 py-4"
            style={{
              background: '#fff3e0',
              borderLeft: '4px solid #e65100',
            }}
          >
            <p className="mb-2 font-semibold text-[#142038]">
              <span aria-hidden>⚠️ </span>
              {t('royal.practiceTitle')}
            </p>
            <BulletList items={t.raw('royal.items') as string[]} />
          </div>
          <p>{t('royal.note')}</p>
        </Section>

        <Section title={t('face.title')} lead={t('face.lead')} photo={SECTION_PHOTOS.face}>
          <p className="font-medium text-[#142038]">{t('face.practiceTitle')}</p>
          <BulletList items={t.raw('face.items') as string[]} />
          <p>{t('face.note')}</p>
        </Section>

        <Section title={t('sanuk.title')} lead={t('sanuk.lead')} photo={SECTION_PHOTOS.sanuk}>
          <p className="font-medium text-[#142038]">{t('sanuk.whyTitle')}</p>
          <BulletList items={t.raw('sanuk.items') as string[]} />
          <p>{t('sanuk.note')}</p>
        </Section>

        <Section title={t('temples.title')} lead={t('temples.lead')} photo={SECTION_PHOTOS.temples}>
          <h3
            className="text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('temples.atTemplesTitle')}
          </h3>
          <BulletList items={t.raw('temples.atTemples') as string[]} />
          <h3
            className="pt-2 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('temples.dailyTitle')}
          </h3>
          <BulletList items={t.raw('temples.daily') as string[]} />
        </Section>

        <Section title={t('modern.title')} lead={t('modern.lead')} photo={SECTION_PHOTOS.modern}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: '🏆',
                value: '#1',
                label: "World's best city for Gen Z\nBangkok 2025",
              },
              {
                icon: '😊',
                value: '84%',
                label: 'Gen Z residents\nfeel happy',
              },
              {
                icon: '💰',
                value: '71%',
                label: 'Rate Bangkok\nbudget-friendly',
              },
            ].map((stat) => (
              <div
                key={stat.value}
                className="rounded-[8px] border border-[#e0e0e0] bg-[#fafafa] p-4 text-center"
              >
                <p className="text-2xl font-bold text-[#142038]">
                  <span aria-hidden>{stat.icon} </span>
                  {stat.value}
                </p>
                <p className="mt-1 whitespace-pre-line text-xs leading-snug text-[#5C5247]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <h3
            className="pt-2 text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('modern.changedTitle')}
          </h3>
          <BulletList items={t.raw('modern.changed') as string[]} />

          <img
            src={SECTION_PHOTOS.contrast.src}
            alt={SECTION_PHOTOS.contrast.alt}
            width={900}
            height={220}
            loading="lazy"
            className="h-[220px] w-full rounded-[8px] object-cover"
          />

          <h3
            className="text-lg font-bold text-[#142038]"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {t('modern.unchangedTitle')}
          </h3>
          <BulletList items={t.raw('modern.unchanged') as string[]} />
        </Section>

        <Section title={t('eating.title')} lead={t('eating.lead')} photo={SECTION_PHOTOS.eating}>
          <BulletList items={t.raw('eating.items') as string[]} />
        </Section>

        <Section title={t('dosDonts.title')}>
          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="rounded-[6px] p-4"
              style={{
                background: '#f0f9f0',
                borderLeft: '3px solid #4caf50',
              }}
            >
              <h3 className="mb-2 text-base font-bold text-[#142038]">
                ✅ {t('dosDonts.doTitle')}
              </h3>
              <BulletList items={t.raw('dosDonts.dos') as string[]} />
            </div>
            <div
              className="rounded-[6px] p-4"
              style={{
                background: '#fff8f0',
                borderLeft: '3px solid #ff9800',
              }}
            >
              <h3 className="mb-2 text-base font-bold text-[#142038]">
                ❌ {t('dosDonts.dontTitle')}
              </h3>
              <BulletList items={t.raw('dosDonts.donts') as string[]} />
            </div>
          </div>
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
