import DrinkWaterShell from '@/components/DrinkWaterShell'

export default function DrinkingWaterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DrinkWaterShell>{children}</DrinkWaterShell>
}
