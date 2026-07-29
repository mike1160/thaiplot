import DrinkWaterCard, { toneClasses } from '@/components/DrinkWaterCard'
import type { DrinkSection } from '@/content/drinking-water'

type Props = {
  section: DrinkSection
  tableHeaders?: { option: string; cost: string; safety: string }
}

export default function DrinkWaterSectionView({ section, tableHeaders }: Props) {
  return (
    <div>
      <h2
        className="text-xl md:text-2xl font-semibold text-[#0A3D5C] border-b-[3px] border-[#1A7BA4] pb-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {section.heading}
      </h2>

      {section.alert ? (
        <div className="bg-[#fff8e6] border border-[#ffc107] rounded-xl px-5 py-4 mb-5 text-[0.95rem] leading-relaxed">
          <strong>{section.alert.strong}</strong> {section.alert.body}
        </div>
      ) : null}

      {section.verdict ? (
        <div className="bg-[#0A3D5C] text-white rounded-2xl px-7 py-8 mb-6 leading-relaxed">
          <h3 className="text-xl font-bold mb-3">{section.verdict.title}</h3>
          <p className="opacity-95 m-0">{section.verdict.body}</p>
        </div>
      ) : null}

      {section.costRows && section.costRows.length > 0 ? (
        <div className="overflow-x-auto mb-6 rounded-xl shadow-[0_2px_12px_rgba(10,61,92,0.08)]">
          <table className="w-full text-sm bg-white border-collapse">
            <thead>
              <tr className="bg-[#0A3D5C] text-white text-left">
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
                    className={i % 2 === 1 ? 'bg-[#E8F4F9]' : 'bg-white'}
                  >
                    <td className="px-4 py-2.5 border-b border-[#E8F4F9] align-top">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${tc.dot} mr-2`} />
                      <strong>{row.option}</strong>
                    </td>
                    <td className="px-4 py-2.5 border-b border-[#E8F4F9] align-top">{row.cost}</td>
                    <td className={`px-4 py-2.5 border-b border-[#E8F4F9] align-top font-semibold ${tc.text}`}>
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
        <article className="bg-white rounded-xl p-5 md:p-6 mb-4 shadow-[0_2px_12px_rgba(10,61,92,0.08)] border-l-[5px] border-l-[#1A7BA4]">
          <span className="inline-block bg-[#1A7BA4] text-white rounded-full px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide mb-2">
            {section.monthlyTitle}
          </span>
          <h3 className="font-bold text-[1.05rem] text-[#2C4A5A] mb-3">{section.monthlyHeading}</h3>
          <ul className="space-y-2 text-[0.95rem]">
            {section.monthlyItems.map((item) => {
              const tc = toneClasses(item.tone)
              return (
                <li key={item.label}>
                  <strong>{item.label}:</strong>{' '}
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
