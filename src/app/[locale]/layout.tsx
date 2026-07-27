import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LegalFooterBar from '@/components/LegalFooterBar'
import CookieConsent from '@/components/CookieConsent'
import HtmlLang from '@/components/HtmlLang'
import { routing } from '@/i18n/routing'

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
  return {
    title: t('title'),
    description: t('description'),
    keywords:
      'Thailand land for sale, Chanote, Hua Hin, Phuket, property marketplace, ThaiPlot',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: 'https://www.thaiplot.com',
    },
    twitter: {
      card: 'summary_large_image',
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
