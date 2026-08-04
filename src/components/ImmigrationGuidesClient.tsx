'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'
import RelatedGuides from '@/components/RelatedGuides'
import { TH_PL_PHOTOS } from '@/content/official-downloads'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="tp-section-title">{title}</h2>
      <div className="tp-body space-y-3">{children}</div>
    </section>
  )
}

const PLAY =
  'https://play.google.com/store/apps/details?id=th.go.immigration.thim'
const APP =
  'https://apps.apple.com/app/thim-thai-immigration-bureau/id6759272559'
const TDAC = 'https://tdac.immigration.go.th'

export function ThimGuideClient() {
  const t = useTranslations('infoThim')
  const tp = useTranslations('partnerLinks')

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={TH_PL_PHOTOS[2]}
      />

      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        <div className="space-y-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
            <a
              href="https://www.immigration.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-[22%] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8973A] focus-visible:ring-offset-2"
              title={t('officialSiteLink')}
            >
              <img
                src="/thim-app.png"
                alt={t('imageAlt')}
                className="h-24 w-24 rounded-[22%] object-cover shadow-[0_8px_28px_rgba(26,39,68,0.18)] transition-transform hover:scale-[1.03] sm:h-28 sm:w-28"
              />
            </a>
            <div className="tp-body min-w-0 flex-1 space-y-3">
              {(t.raw('intro') as string[]).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <a href={PLAY} target="_blank" rel="noopener noreferrer" className="tp-btn-primary">
                  {t('android')}
                </a>
                <a href={APP} target="_blank" rel="noopener noreferrer" className="tp-btn-outline">
                  {t('ios')}
                </a>
                <Link href="/info/thailand-digital-arrival-card" className="tp-btn-outline-gold">
                  {t('tdacPageLink')}
                </Link>
              </div>
              <p className="text-xs text-[#8A7F72]">{t('storeNote')}</p>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
            <img
              src="/THIM-APP-2.png"
              alt={t('imageAlt2')}
              className="w-full rounded-[12px] object-cover shadow-[0_12px_40px_rgba(26,39,68,0.16)]"
            />
            <figcaption className="mt-3 text-center text-xs text-[#8A7F72]">
              {t('imageCaption2')}
            </figcaption>
          </figure>
        </div>

        <Section title={t('whatTitle')}>
          {(t.raw('whatParas') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('compareTitle')}>
          <p>{t('compareIntro')}</p>
          <div className="mt-2 overflow-x-auto border border-[#E8E2D6] bg-white rounded-[12px]">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-[#1A2744] text-left text-white">
                  <th className="px-3 py-2.5">{t('table.topic')}</th>
                  <th className="px-3 py-2.5">TDAC</th>
                  <th className="px-3 py-2.5">THIM</th>
                </tr>
              </thead>
              <tbody>
                {(t.raw('table.rows') as { topic: string; tdac: string; thim: string }[]).map(
                  (row, i) => (
                    <tr key={row.topic} className={i % 2 ? 'bg-[#FAF7F0]' : 'bg-white'}>
                      <td className="border-t border-[#E8E2D6] px-3 py-2.5 font-medium text-[#1A2744]">
                        {row.topic}
                      </td>
                      <td className="border-t border-[#E8E2D6] px-3 py-2.5">{row.tdac}</td>
                      <td className="border-t border-[#E8E2D6] px-3 py-2.5">{row.thim}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="pt-2 font-medium text-[#C0392B]">{t('scamWarning')}</p>
        </Section>

        <Section title={t('featuresTitle')}>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('features') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('howtoTitle')}>
          {(t.raw('howtoParas') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('tipsTitle')}>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('tips') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('faqTitle')}>
          <dl className="space-y-5">
            {(t.raw('faqs') as { q: string; a: string }[]).map((faq) => (
              <div key={faq.q}>
                <dt className="mb-1 font-semibold text-[#1A2744]">{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('beforeTitle')}>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('beforeItems') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
          <p className="pt-3 font-medium text-[#1A2744]">{t('note')}</p>
        </Section>

        <RelatedGuides
          title={tp('relatedOnThaiPlot')}
          links={[
            { href: '/info/thailand-digital-arrival-card', label: tp('linkTdac') },
            { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
            { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
            { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          ]}
        />

        <div className="border-t border-[#E8E2D6] pt-6">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}

export function TdacGuideClient() {
  const t = useTranslations('infoTdac')
  const tp = useTranslations('partnerLinks')

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        image={TH_PL_PHOTOS[6]}
      />

      <div className="mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        <div className="tp-body space-y-3">
          {(t.raw('intro') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={TDAC} target="_blank" rel="noopener noreferrer" className="tp-btn-primary">
              {t('officialCta')}
            </a>
            <Link href="/info/thim-app" className="tp-btn-outline-gold">
              {t('thimPageLink')}
            </Link>
          </div>
          <p className="font-medium text-[#C0392B]">{t('scamWarning')}</p>
        </div>

        <Section title={t('whatTitle')}>
          {(t.raw('whatParas') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('whoTitle')}>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('whoItems') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('howtoTitle')}>
          <ol className="list-decimal space-y-1.5 pl-5">
            {(t.raw('howtoSteps') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ol>
        </Section>

        <Section title={t('tipsTitle')}>
          <ul className="list-disc space-y-1.5 pl-5">
            {(t.raw('tips') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('faqTitle')}>
          <dl className="space-y-5">
            {(t.raw('faqs') as { q: string; a: string }[]).map((faq) => (
              <div key={faq.q}>
                <dt className="mb-1 font-semibold text-[#1A2744]">{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('relatedTitle')}>
          <p>{t('relatedBody')}</p>
        </Section>

        <RelatedGuides
          title={tp('relatedOnThaiPlot')}
          links={[
            { href: '/info/thim-app', label: tp('linkThim') },
            { href: '/info/official-thai-downloads', label: tp('linkOfficial') },
            { href: '/info/paperwork-thailand', label: tp('linkPaperwork') },
            { href: '/info/visa-retirement-thailand', label: tp('linkVisa') },
          ]}
        />

        <p className="text-sm font-medium text-[#1A2744]">{t('note')}</p>

        <div className="border-t border-[#E8E2D6] pt-6">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}
