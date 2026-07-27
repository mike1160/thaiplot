import { type ReactNode } from 'react'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'

type InfoSection = {
  title: string
  body: ReactNode
}

type InfoPageShellProps = {
  title: string
  subtitle?: string
  sections: InfoSection[]
  bottomSlot?: ReactNode
  heroImage?: string
}

export default function InfoPageShell({
  title,
  subtitle,
  sections,
  bottomSlot,
  heroImage,
}: InfoPageShellProps) {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero title={title} subtitle={subtitle} image={heroImage} size="secondary" />

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2
              className="text-xl md:text-2xl font-bold text-[#1A2744] mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {section.title}
            </h2>
            <div className="text-[#5C5247] text-sm md:text-base leading-relaxed space-y-3">
              {section.body}
            </div>
          </section>
        ))}

        {bottomSlot ? <div className="pt-4">{bottomSlot}</div> : null}

        <div className="pt-4 border-t border-[#E8E2D6]">
          <DisclaimerFooter />
        </div>
      </article>
    </main>
  )
}
