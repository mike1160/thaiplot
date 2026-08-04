import { type ReactNode } from 'react'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import DisclaimerFooter from '@/components/DisclaimerFooter'
import InfoHero from '@/components/InfoHero'

export type InfoSection = {
  title: string
  body: ReactNode
  image?: string
  imageAlt?: string
  imageCaption?: string
}

type InfoPageShellProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  sections: InfoSection[]
  bottomSlot?: ReactNode
  heroImage?: string
}

export default function InfoPageShell({
  title,
  subtitle,
  eyebrow,
  sections,
  bottomSlot,
  heroImage,
}: InfoPageShellProps) {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#1A2744]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={heroImage}
        size="secondary"
      />

      <article className="mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        {sections.map((section) => (
          <section key={section.title} className="animate-fade-in-up">
            <h2 className="tp-section-title">{section.title}</h2>
            {section.image ? (
              <figure className="mb-5 overflow-hidden rounded-[12px] border border-[#E8E2D6] bg-white shadow-[0_8px_28px_rgba(26,39,68,0.08)]">
                <img
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  className="h-auto w-full object-cover max-h-[280px] md:max-h-[320px]"
                />
                {section.imageCaption ? (
                  <figcaption className="px-4 py-2.5 text-xs text-[#8A7F72] border-t border-[#E8E2D6] bg-[rgba(255,255,255,0.65)] backdrop-blur-sm">
                    {section.imageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            <div className="tp-body space-y-3">{section.body}</div>
          </section>
        ))}

        {bottomSlot ? <div className="space-y-10 pt-2">{bottomSlot}</div> : null}

        <div className="border-t border-[#E8E2D6] pt-6">
          <DisclaimerFooter />
        </div>
      </article>
    </main>
  )
}
