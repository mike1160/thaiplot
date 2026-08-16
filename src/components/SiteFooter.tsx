'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function SiteFooter() {
  const t = useTranslations('homepage')
  const tn = useTranslations('navigation')
  const td = useTranslations('thaiData')

  return (
    <footer>
      <div className="border-t border-[#E8E2D6] bg-[#FAF7F0]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#1A2744] font-semibold text-lg mb-1">{t('donateTitle')}</p>
            <p className="text-[#5C5247] text-sm">{t('donateText')}</p>
          </div>
          <a
            href="https://www.savedsouls-foundation.org/en/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 tp-btn-accent px-8 py-3 text-sm whitespace-nowrap"
          >
            {t('donateCta')}
          </a>
        </div>
      </div>

      <div
        className="bg-[#1A2744] text-white overflow-hidden"
        style={{
          backgroundImage: `url('/thai-pattern.svg')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '80px 80px',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 48,
              padding: '0',
            }}
          >
            {/* Saved Souls Foundation */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32 }}>🐾</div>
              <p
                style={{
                  color: '#C8973A',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  margin: 0,
                }}
              >
                GOED DOEL · THAILAND
              </p>
              <p
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                Saved Souls Foundation
              </p>
              <p style={{ color: '#9BA8BB', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                Duizenden honden leven op straat in Thailand zonder zorg of onderdak. Saved Souls
                redt, behandelt en herplaatst ze. Elke donatie maakt direct verschil.
              </p>
              <a
                href="https://www.savedsouls-foundation.org/en/donate"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#C8973A',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '10px 20px',
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginTop: 4,
                  alignSelf: 'flex-start',
                }}
              >
                🐕 Doneer nu → savedsouls.org
              </a>
              <p style={{ color: '#9BA8BB', fontSize: 11, margin: 0 }}>
                Non-profit · Geregistreerd in Thailand · 100% naar de honden
              </p>
            </div>

            {/* WaiAir */}
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1.5px solid #ff6400',
                borderRadius: 14,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32 }}>✈️</div>
              <p
                style={{
                  color: '#ff6400',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  margin: 0,
                }}
              >
                GRATIS APP · iOS
              </p>
              <p
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                WaiAir — vluchttracker
              </p>
              <p style={{ color: '#9BA8BB', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                Realtime vertrekken, aankomsten en gate-info voor 26 luchthavens in Thailand,
                Indonesië, Maleisië, Singapore, Vietnam en de Filipijnen.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <a
                  href="https://apps.apple.com/ph/app/waiair/id6798072839"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: '#fff',
                    color: '#000',
                    borderRadius: 10,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  🍎 Download — App Store
                </a>
                <a
                  href="/waiair"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: '#ff6400',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '10px 4px',
                  }}
                >
                  Meer info →
                </a>
              </div>
              <p style={{ color: '#9BA8BB', fontSize: 11, margin: 0 }}>
                26 luchthavens · 6 landen · Gratis
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 40,
            }}
          >
          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerExplore')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/listings" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('listings')}
                </Link>
              </li>
              <li>
                <Link href="/list-property" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('listProperty')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('contact')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  {tn('news')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/thim-app"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideThim')}
                </Link>
              </li>
              <li>
                <a
                  href="/waiair"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideWaiairApp')}
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c]">
                    {tn('guideWaiairNew')}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/koh-phangan-foreign-investors.html"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideKohPhanganInvestors')}
                </a>
              </li>
              <li>
                <Link
                  href="/info/thailand-digital-arrival-card"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideTdac')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/official-thai-downloads"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideOfficialDownloads')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/paperwork-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guidePaperwork')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/visa-retirement-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideVisa')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/thailand-retirement-ranking-2026"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideRetirementRanking')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/drinking-water-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideDrinkWater')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/health-accidents-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideHealth')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/transport-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideTransport')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/thai-islands"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideIslands')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/living-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideLiving')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/food-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideFood')}
                </Link>
              </li>
              <li>
                <Link
                  href="/info/buying-land-thailand"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {tn('guideBuying')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerRegions')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/hua-hin" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Land in Hua Hin
                </Link>
              </li>
              <li>
                <Link href="/pranburi" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Land in Pranburi
                </Link>
              </li>
              <li>
                <Link
                  href="/listings?region=Prachuap%20Khiri%20Khan"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Prachuap Khiri Khan
                </Link>
              </li>
              <li>
                <Link
                  href="/black-mountain"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Land near Black Mountain
                </Link>
              </li>
              <li>
                <Link href="/phuket" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Property in Phuket
                </Link>
              </li>
              <li>
                <Link href="/bangkok" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Property in Bangkok
                </Link>
              </li>
              <li>
                <Link
                  href="/hin-lek-fai"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Land in Hin Lek Fai
                </Link>
              </li>
              <li>
                <Link
                  href="/villas-for-sale-hua-hin"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Villas in Hua Hin
                </Link>
              </li>
              <li>
                <Link
                  href="/resort-for-sale-hua-hin"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  Resorts & Farms
                </Link>
              </li>
              <li>
                <Link href="/koh-samui" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Property in Koh Samui
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerResources')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/disclaimer" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white/70 hover:text-[#C8973A] transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {t('footerPartner')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.hua-hin-land.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {t('footerPartnerHuaHinLand')}
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-[#C8973A] text-xs uppercase tracking-widest font-medium mb-4">
              {td('footerTools')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://data.hua-hin-land.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#C8973A] transition-colors"
                >
                  {td('footerVerify')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/45">
            <p className="text-center lg:text-left">{t('footerCopyright')}</p>
            <a
              href="https://allesis.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C8973A] transition-colors"
            >
              {tn('webdesignBy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
