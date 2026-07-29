'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/search-requests', label: 'Zoekopdrachten' },
  { href: '/admin/users', label: 'Gebruikers' },
] as const

function AdminNavbar() {
  const pathname = usePathname()

  return (
    <header
      style={{
        background: '#1A2744',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 16px',
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/admin/listings"
          style={{
            color: '#C8973A',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          ThaiPlot Admin
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: active ? '#C8973A' : '#fff',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '8px 12px',
                  borderRadius: 8,
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            style={{
              border: '1px solid rgba(200, 151, 58, 0.5)',
              background: 'transparent',
              color: '#C8973A',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Uitloggen
          </button>
        </form>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0' }}>
      <AdminNavbar />
      <div style={{ background: '#fff', minHeight: 'calc(100vh - 56px)', padding: 24 }}>
        {children}
      </div>
    </div>
  )
}
