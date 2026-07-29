'use client'

import { useId, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const AUTH_PATHS = ['/portal/login', '/portal/register', '/portal/reset-password', '/portal/new-password']

const NAV_LINKS = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/listings', label: 'Mijn Aanbod' },
  { href: '/portal/search-requests', label: 'Zoekopdrachten' },
] as const

export default function PortalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const panelId = useId()

  if (AUTH_PATHS.includes(pathname)) {
    return null
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      const supabase = getSupabaseBrowser()
      await supabase.auth.signOut()
      router.replace('/portal/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  const linkStyle = (href: string): CSSProperties => ({
    color: pathname === href || pathname.startsWith(href + '/') ? '#C8973A' : '#fff',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: 8,
  })

  return (
    <header
      style={{
        background: '#1A2744',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 16px',
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Link
          href="/portal/dashboard"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 18,
            fontWeight: 600,
            color: '#fff',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          ThaiPlot
          <span style={{ color: '#C8973A', marginLeft: 4, fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}>
            Portal
          </span>
        </Link>

        <nav className="portal-nav-desktop" style={{ display: 'none', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="portal-nav-desktop"
            style={{
              display: 'none',
              border: '1px solid rgba(200, 151, 58, 0.5)',
              background: 'transparent',
              color: '#C8973A',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: loggingOut ? 'wait' : 'pointer',
            }}
          >
            {loggingOut ? 'Bezig…' : 'Uitloggen'}
          </button>

          <button
            type="button"
            className="portal-nav-mobile"
            aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              border: 'none',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: 8,
            }}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={panelId}
          className="portal-nav-mobile"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 16px 16px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                ...linkStyle(link.href),
                display: 'block',
                padding: '12px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              marginTop: 12,
              width: '100%',
              minHeight: 44,
              border: '1px solid rgba(200, 151, 58, 0.5)',
              background: 'transparent',
              color: '#C8973A',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loggingOut ? 'wait' : 'pointer',
            }}
          >
            {loggingOut ? 'Bezig…' : 'Uitloggen'}
          </button>
        </div>
      ) : null}

      <style>{`
        @media (min-width: 768px) {
          .portal-nav-desktop { display: flex !important; }
          .portal-nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
