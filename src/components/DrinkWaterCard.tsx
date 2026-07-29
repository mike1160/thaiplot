import type { DrinkCard, DrinkTone } from '@/content/drinking-water'

const TONE: Record<DrinkTone, { border: string; badge: string; text: string; dot: string }> = {
  danger: {
    border: 'border-l-[#C0392B]',
    badge: 'bg-[#C0392B]',
    text: 'text-[#C0392B]',
    dot: 'bg-[#C0392B]',
  },
  caution: {
    border: 'border-l-[#E67E22]',
    badge: 'bg-[#E67E22]',
    text: 'text-[#E67E22]',
    dot: 'bg-[#E67E22]',
  },
  good: {
    border: 'border-l-[#27AE60]',
    badge: 'bg-[#27AE60]',
    text: 'text-[#27AE60]',
    dot: 'bg-[#27AE60]',
  },
  info: {
    border: 'border-l-[#1A7BA4]',
    badge: 'bg-[#1A7BA4]',
    text: 'text-[#1A7BA4]',
    dot: 'bg-[#1A7BA4]',
  },
}

export function toneClasses(tone: DrinkTone) {
  return TONE[tone]
}

export default function DrinkWaterCard({ card }: { card: DrinkCard }) {
  const t = TONE[card.tone]
  return (
    <article
      className={`bg-white rounded-xl p-5 md:p-6 mb-4 shadow-[0_2px_12px_rgba(10,61,92,0.08)] border-l-[5px] ${t.border}`}
    >
      <span
        className={`inline-block ${t.badge} text-white rounded-full px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide mb-2`}
      >
        {card.badge}
      </span>
      <h3 className="font-bold text-[1.05rem] text-[#2C4A5A] mb-2">{card.title}</h3>
      {card.body.map((p) => (
        <p key={p.slice(0, 40)} className="text-[#1A2933] leading-relaxed mb-2.5 text-[0.95rem] md:text-base">
          {p}
        </p>
      ))}
      {card.list && card.list.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1.5 text-[#1A2933] text-[0.95rem] leading-relaxed mt-1">
          {card.list.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      ) : null}
      {card.source ? (
        <p className="text-xs text-[#8DB4C8] italic mt-2">{card.source}</p>
      ) : null}
    </article>
  )
}
