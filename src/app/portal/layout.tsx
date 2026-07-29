import type { ReactNode } from 'react'
import PortalNav from '@/components/PortalNav'

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF7F0',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1A2744',
      }}
    >
      <PortalNav />
      {children}
    </div>
  )
}
