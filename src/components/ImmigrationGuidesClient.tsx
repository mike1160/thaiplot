'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import RelatedGuides from '@/components/RelatedGuides'
import { TH_PL_PHOTOS } from '@/content/official-downloads'

function CloudFade({ position }: { position: 'top' | 'bottom' }) {
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
          fill="#FAF7F0"
          d="M0,48 C180,78 320,12 480,36 C640,60 780,88 960,40 C1120,4 1280,28 1440,52 L1440,80 L0,80 Z"
        />
        <path
          fill="#FAF7F0"
          opacity="0.55"
          d="M0,56 C220,20 400,72 560,48 C720,24 900,8 1080,44 C1240,72 1360,60 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2
        className="text-xl md:text-2xl font-bold text-[#1A2744] border-b border-[#E8E2D6] pb-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm md:text-[15px] text-[#5C5247] leading-relaxed">
        {children}
      </div>
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
      <section className="relative min-h-[48vh] flex items-end overflow-hidden">
        <img
          src={TH_PL_PHOTOS[2]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(26,39,68,0.92) 0%, rgba(26,39,68,0.4) 55%, rgba(26,39,68,0.25) 100%)',
          }}
        />
        <CloudFade position="bottom" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 pt-28 w-full">
          <p className="text-[#C8973A] text-xs uppercase tracking-[0.2em] mb-3">{t('eyebrow')}</p>
          <h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-12">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
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
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-[22%] shadow-[0_8px_28px_rgba(26,39,68,0.18)] object-cover transition-transform hover:scale-[1.03]"
              />
            </a>
            <div className="space-y-3 text-sm md:text-[15px] text-[#5C5247] leading-relaxed min-w-0 flex-1">
              {(t.raw('intro') as string[]).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={PLAY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-4 py-2.5 text-sm font-semibold bg-[#1A2744] text-white hover:bg-[#C8973A] transition-colors"
                >
                  {t('android')}
                </a>
                <a
                  href={APP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex px-4 py-2.5 text-sm font-semibold border border-[#1A2744] text-[#1A2744] hover:border-[#C8973A] hover:text-[#C8973A] transition-colors"
                >
                  {t('ios')}
                </a>
                <Link
                  href="/info/thailand-digital-arrival-card"
                  className="inline-flex px-4 py-2.5 text-sm font-semibold border border-[#C8973A] text-[#C8973A] hover:bg-[#C8973A] hover:text-white transition-colors"
                >
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
              className="w-full rounded-2xl shadow-[0_12px_40px_rgba(26,39,68,0.16)] object-cover"
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
          <div className="overflow-x-auto border border-[#E8E2D6] bg-white mt-2">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-[#1A2744] text-white text-left">
                  <th className="px-3 py-2.5">{t('table.topic')}</th>
                  <th className="px-3 py-2.5">TDAC</th>
                  <th className="px-3 py-2.5">THIM</th>
                </tr>
              </thead>
              <tbody>
                {(t.raw('table.rows') as { topic: string; tdac: string; thim: string }[]).map(
                  (row, i) => (
                    <tr key={row.topic} className={i % 2 ? 'bg-[#FAF7F0]' : 'bg-white'}>
                      <td className="px-3 py-2.5 font-medium text-[#1A2744] border-t border-[#E8E2D6]">
                        {row.topic}
                      </td>
                      <td className="px-3 py-2.5 border-t border-[#E8E2D6]">{row.tdac}</td>
                      <td className="px-3 py-2.5 border-t border-[#E8E2D6]">{row.thim}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[#C0392B] font-medium pt-2">{t('scamWarning')}</p>
        </Section>

        <Section title={t('featuresTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
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
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('tips') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('faqTitle')}>
          <dl className="space-y-5">
            {(t.raw('faqs') as { q: string; a: string }[]).map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold text-[#1A2744] mb-1">{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={t('beforeTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
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

        <div className="pt-4 border-t border-[#E8E2D6]">
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
      <section className="relative min-h-[48vh] flex items-end overflow-hidden">
        <img
          src={TH_PL_PHOTOS[6]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(26,39,68,0.92) 0%, rgba(26,39,68,0.4) 55%, rgba(26,39,68,0.25) 100%)',
          }}
        />
        <CloudFade position="bottom" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 pt-28 w-full">
          <p className="text-[#C8973A] text-xs uppercase tracking-[0.2em] mb-3">{t('eyebrow')}</p>
          <h1
            className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-white/85 text-sm md:text-base max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-12">
        <div className="space-y-3 text-sm md:text-[15px] text-[#5C5247] leading-relaxed">
          {(t.raw('intro') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={TDAC}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-4 py-2.5 text-sm font-semibold bg-[#1A2744] text-white hover:bg-[#C8973A] transition-colors"
            >
              {t('officialCta')}
            </a>
            <Link
              href="/info/thim-app"
              className="inline-flex px-4 py-2.5 text-sm font-semibold border border-[#C8973A] text-[#C8973A] hover:bg-[#C8973A] hover:text-white transition-colors"
            >
              {t('thimPageLink')}
            </Link>
          </div>
          <p className="text-[#C0392B] font-medium">{t('scamWarning')}</p>
        </div>

        <Section title={t('whatTitle')}>
          {(t.raw('whatParas') as string[]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </Section>

        <Section title={t('whoTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('whoItems') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('howtoTitle')}>
          <ol className="list-decimal pl-5 space-y-1.5">
            {(t.raw('howtoSteps') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ol>
        </Section>

        <Section title={t('tipsTitle')}>
          <ul className="list-disc pl-5 space-y-1.5">
            {(t.raw('tips') as string[]).map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title={t('faqTitle')}>
          <dl className="space-y-5">
            {(t.raw('faqs') as { q: string; a: string }[]).map((faq) => (
              <div key={faq.q}>
                <dt className="font-semibold text-[#1A2744] mb-1">{faq.q}</dt>
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

        <p className="font-medium text-[#1A2744] text-sm">{t('note')}</p>

        <div className="pt-4 border-t border-[#E8E2D6]">
          <DisclaimerFooter />
        </div>
      </div>
    </main>
  )
}
