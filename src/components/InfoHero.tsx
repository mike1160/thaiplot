type InfoHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Background image URL (local path or absolute). */
  image?: string
  /** Main pages use taller heroes. */
  size?: 'main' | 'secondary'
}

export default function InfoHero({
  eyebrow,
  title,
  subtitle,
  image,
  size = 'secondary',
}: InfoHeroProps) {
  const minHeight = size === 'main' ? 'min-h-[70vh]' : 'min-h-[50vh]'

  return (
    <section
      className={`relative ${minHeight} flex items-center justify-center overflow-hidden py-16 md:py-24 px-6 ${
        image ? '' : 'bg-[#1A2744]'
      }`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
        </>
      ) : null}

      <div className="relative z-10 max-w-3xl mx-auto text-center w-full">
        {eyebrow ? (
          <p className="text-[#C8973A] text-xs md:text-sm font-medium uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
