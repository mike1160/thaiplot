import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LegalFooterBar from '@/components/LegalFooterBar'
import CookieConsent from '@/components/CookieConsent'
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
      'land for sale Thailand, Hua Hin property, chanote land, buy land Thailand foreigner, Pranburi land, Thailand real estate',
    alternates: {
      canonical,
      languages,
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
      <HtmlLang />
      {children}
      <LegalFooterBar />
      <CookieConsent />
      <Analytics />
    </NextIntlClientProvider>
  )
}
