import DrinkWaterCard, { toneClasses } from '@/components/DrinkWaterCard'
import type { DrinkSection } from '@/content/drinking-water'

type Props = {
  section: DrinkSection
  tableHeaders?: { option: string; cost: string; safety: string }
}

export default function DrinkWaterSectionView({ section, tableHeaders }: Props) {
  return (
    <div>
      <h2 className="tp-section-title">{section.heading}</h2>

      {section.alert ? (
        <div className="bg-[#FFF8F6] border border-[#C0392B]/35 rounded-[12px] px-5 py-4 mb-5 text-[0.95rem] leading-relaxed">
          <strong>{section.alert.strong}</strong> {section.alert.body}
        </div>
      ) : null}

      {section.verdict ? (
        <div className="bg-[#1A2744] text-white rounded-[12px] px-7 py-8 mb-6 leading-relaxed">
          <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {section.verdict.title}
          </h3>
          <p className="opacity-95 m-0">{section.verdict.body}</p>
        </div>
      ) : null}

      {section.costRows && section.costRows.length > 0 ? (
        <div className="overflow-x-auto mb-6 rounded-[12px] border border-[#E8E2D6]">
          <table className="w-full text-sm bg-white border-collapse">
            <thead>
              <tr className="bg-[#1A2744] text-white text-left">
                <th className="px-4 py-3 font-semibold">{tableHeaders?.option ?? 'Option'}</th>
                <th className="px-4 py-3 font-semibold">{tableHeaders?.cost ?? 'Cost'}</th>
                <th className="px-4 py-3 font-semibold">{tableHeaders?.safety ?? 'Safety'}</th>
              </tr>
            </thead>
            <tbody>
              {section.costRows.map((row, i) => {
                const tc = toneClasses(row.tone)
                return (
                  <tr
                    key={row.option}
                    className={i % 2 === 1 ? 'bg-[#FAF7F0]' : 'bg-white'}
                  >
                    <td className="px-4 py-2.5 border-b border-[#E8E2D6] align-top">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${tc.dot} mr-2`} />
                      <strong>{row.option}</strong>
                    </td>
                    <td className="px-4 py-2.5 border-b border-[#E8E2D6] align-top">{row.cost}</td>
                    <td className={`px-4 py-2.5 border-b border-[#E8E2D6] align-top font-semibold ${tc.text}`}>
                      {row.safety}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {section.monthlyItems && section.monthlyItems.length > 0 ? (
        <article className="bg-white rounded-[12px] p-5 md:p-6 mb-4 border border-[#E8E2D6] border-l-[4px] border-l-[#C8973A]">
          <span className="inline-block bg-[#1A2744] text-white rounded-[12px] px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide mb-2">
            {section.monthlyTitle}
          </span>
          <h3 className="font-bold text-[1.05rem] text-[#1A2744] mb-3">{section.monthlyHeading}</h3>
          <ul className="space-y-2 text-[0.95rem] text-[#5C5247]">
            {section.monthlyItems.map((item) => {
              const tc = toneClasses(item.tone)
              return (
                <li key={item.label}>
                  <strong className="text-[#1A2744]">{item.label}:</strong>{' '}
                  <span className={`font-semibold ${tc.text}`}>{item.value}</span>
                </li>
              )
            })}
          </ul>
        </article>
      ) : null}

      {section.costConclusion ? <DrinkWaterCard card={section.costConclusion} /> : null}

      {section.cards.map((card) => (
        <DrinkWaterCard key={`${card.badge}-${card.title}`} card={card} />
      ))}
    </div>
  )
}
