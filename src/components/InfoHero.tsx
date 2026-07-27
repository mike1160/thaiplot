type InfoHeroProps = {
  title: string
  subtitle?: string
}

export default function InfoHero({ title, subtitle }: InfoHeroProps) {
  return (
    <section className="bg-[#1A2744] py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
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
