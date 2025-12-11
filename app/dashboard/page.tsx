import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import data from "./data.json"

export default function Page() {
  return (
    <div>
      <SectionCards />
          <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
          </div>
    </div>
  )
}
