import type { Metadata } from 'next'
import Script from 'next/script'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LegalFooterBar from '@/components/LegalFooterBar'
import CookieConsent from '@/components/CookieConsent'
import ConsentAnalytics from '@/components/ConsentAnalytics'
import HtmlLang from '@/components/HtmlLang'
import { routing } from '@/i18n/routing'
import { localizedPath, SITE_URL } from '@/lib/seo'

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
      'land for sale Thailand, Hua Hin property, chanote land, buy land Thailand foreigner, Pranburi land, Thailand real estate',
    alternates: {
      canonical,
      languages,
      types: {
        'text/plain': `${SITE_URL}/llms.txt`,
      },
    },
    other: {
      'llms-txt': `${SITE_URL}/llms.txt`,
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
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      ) : null}
      <HtmlLang />
      <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-0">
        {children}
      </div>
      <LegalFooterBar />
      <CookieConsent />
      <ConsentAnalytics />
    </NextIntlClientProvider>
  )
}
