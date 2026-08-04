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
  heroImageAlt?: string
}

export default function InfoPageShell({
  title,
  subtitle,
  eyebrow,
  sections,
  bottomSlot,
  heroImage,
  heroImageAlt = '',
}: InfoPageShellProps) {
  return (
    <main className="min-h-screen text-[#142038]">
      <BreadcrumbNav />
      <InfoHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={heroImage}
        imageAlt={heroImageAlt}
        size="secondary"
      />

      <article className="relative mx-auto max-w-3xl space-y-12 px-6 py-12 md:py-16">
        {/* Soft depth panel behind content so frost headers read clearly */}
        <div
          className="pointer-events-none absolute inset-x-3 top-6 bottom-6 -z-10 rounded-[20px] md:inset-x-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(239,230,214,0.45) 100%)',
            boxShadow: '0 20px 60px rgba(20,32,56,0.05)',
          }}
          aria-hidden
        />

        {sections.map((section) => (
          <section key={section.title} className="animate-fade-in-up">
            <h2 className="tp-section-title">{section.title}</h2>
            {section.image ? (
              <figure
                className={`mb-5 overflow-hidden border border-white/70 bg-white/40 shadow-[0_16px_40px_rgba(20,32,56,0.1)] backdrop-blur-sm ${
                  section.imageCaption ? 'rounded-[14px]' : 'my-6 rounded-[8px]'
                }`}
              >
                <img
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  loading="lazy"
                  className={
                    section.imageCaption
                      ? 'h-auto w-full object-cover max-h-[300px] md:max-h-[340px] transition-transform duration-700 hover:scale-[1.02]'
                      : 'h-[200px] w-full object-cover sm:h-[260px]'
                  }
                />
                {section.imageCaption ? (
                  <figcaption className="border-t border-[#E8E2D6]/80 bg-[rgba(255,255,255,0.72)] px-4 py-2.5 text-xs text-[#8A7F72] backdrop-blur-md">
                    {section.imageCaption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            <div className="tp-body space-y-3 px-0.5">{section.body}</div>
          </section>
        ))}

        {bottomSlot ? <div className="space-y-10 pt-2">{bottomSlot}</div> : null}

        <div className="border-t border-[#E8E2D6]/90 pt-6">
          <DisclaimerFooter />
        </div>
      </article>
    </main>
  )
}
