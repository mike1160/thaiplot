type InfoHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Background image URL (local path or absolute). */
  image?: string
  /** Accessible description when the hero image is meaningful. */
  imageAlt?: string
  /** Main pages use taller heroes. */
  size?: 'main' | 'secondary'
}

/** Shared full-bleed hero — exclusive glass title plate on all subpages. */
export default function InfoHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt = '',
  size = 'secondary',
}: InfoHeroProps) {
  const minHeight = size === 'main' ? 'min-h-[68vh]' : 'min-h-[52vh]'

  return (
    <section
      className={`relative ${minHeight} flex items-end overflow-hidden ${
        image ? '' : 'bg-[#142038]'
      }`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center animate-hero-drift"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(20,32,56,0.78) 0%, rgba(20,32,56,0.45) 45%, rgba(20,32,56,0.72) 100%), linear-gradient(to top, rgba(20,32,56,0.92) 0%, rgba(20,32,56,0.35) 55%, rgba(20,32,56,0.2) 100%)',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url('/thai-pattern.svg')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '72px 72px',
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(800px 400px at 20% 80%, rgba(200,151,58,0.22), transparent 60%), linear-gradient(160deg, #0f1a2e 0%, #1a2744 55%, #142038 100%)',
            }}
          />
        </>
      )}

      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(200,151,58,0.45), transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="tp-hero-glass animate-fade-in-up">
          {eyebrow ? (
            <p className="relative z-[1] mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E8C56A] md:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="relative z-[1] mb-3 max-w-3xl text-3xl font-bold leading-[1.12] text-white md:text-5xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="tp-hero-subtitle relative z-[1] max-w-2xl text-sm leading-relaxed md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
