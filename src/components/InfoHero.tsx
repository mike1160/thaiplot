type InfoHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Background image URL (local path or absolute). */
  image?: string
  /** Main pages use taller heroes. */
  size?: 'main' | 'secondary'
}

/** Shared full-bleed hero for all info / guide / legal subpages. */
export default function InfoHero({
  eyebrow,
  title,
  subtitle,
  image,
  size = 'secondary',
}: InfoHeroProps) {
  const minHeight = size === 'main' ? 'min-h-[62vh]' : 'min-h-[46vh]'

  return (
    <section
      className={`relative ${minHeight} flex items-end overflow-hidden ${
        image ? '' : 'bg-[#1A2744]'
      }`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26,39,68,0.94) 0%, rgba(26,39,68,0.55) 48%, rgba(26,39,68,0.28) 100%)',
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('/thai-pattern.svg')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '80px 80px',
          }}
          aria-hidden
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-14 pt-28 md:pb-16 md:pt-32">
        {eyebrow ? (
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#C8973A] md:text-xs animate-fade-in-up">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="mb-4 max-w-3xl text-3xl font-bold leading-[1.15] text-white md:text-5xl animate-fade-in-up"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', animationDelay: '0.06s' }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className="max-w-2xl text-sm leading-relaxed text-white/85 md:text-base animate-fade-in-up"
            style={{ animationDelay: '0.12s' }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
