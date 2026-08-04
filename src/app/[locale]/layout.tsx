import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LegalFooterBar from '@/components/LegalFooterBar'
import CookieConsent from '@/components/CookieConsent'
import ConsentAnalytics from '@/components/ConsentAnalytics'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import HtmlLang from '@/components/HtmlLang'
import { routing } from '@/i18n/routing'
import { localizedPath, SITE_URL } from '@/lib/seo'

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'Metadata' })
  const title = t('title')
  const description = t('description')
  const canonical = localizedPath(params.locale, '/')
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = localizedPath(loc, '/')
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords:
      'land for sale Thailand, Hua Hin property, vastgoed Thailand, huizen te koop Thailand, real estate Thailand, grond kopen Thailand, buy land Thailand foreigner, houses Thailand, Chanote land, Pranburi land, Thailand real estate, THIM app, Thailand Immigration Management, Thailand Digital Arrival Card, TDAC Thailand, Papieren Thailand, Officiële Thaise websites, health insurance Thailand, medische kosten Thailand, zorgverzekering Thailand, ongevallen Thailand',
    alternates: {
      canonical,
      languages,
      types: {
        'text/plain': `${SITE_URL}/llms.txt`,
      },
    },
    other: {
      'llms-txt': `${SITE_URL}/llms.txt`,
      'p:domain_verify': '607976f15f114c1775ec4024af8f60e7',
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'ThaiPlot',
      locale: params.locale === 'zh' ? 'zh_CN' : params.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang />
      <div className="w-full max-w-full px-4 sm:px-0">
        {children}
      </div>
      <LegalFooterBar />
      <CookieConsent />
      <ConsentAnalytics />
      <ExitIntentPopup locale={locale} />
    </NextIntlClientProvider>
  )
}
