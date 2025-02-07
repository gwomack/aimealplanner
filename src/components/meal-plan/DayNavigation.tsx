
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

interface DayNavigationProps {
  selectedDay: string
  setSelectedDay: (day: string) => void
}

export const DayNavigation = ({ selectedDay, setSelectedDay }: DayNavigationProps) => {
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="flex items-center justify-between mb-8 bg-card rounded-lg p-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const currentIndex = DAYS_OF_WEEK.indexOf(selectedDay)
          const prevIndex = (currentIndex - 1 + 7) % 7
          setSelectedDay(DAYS_OF_WEEK[prevIndex])
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <Button
            key={day}
            variant={day === selectedDay ? "default" : "ghost"}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "px-3 py-1 text-sm relative",
              day === selectedDay && "bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white",
              day === today && "after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-[#F97316] after:rounded-full after:-top-0.5 after:left-1/2 after:-translate-x-1/2"
            )}
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const currentIndex = DAYS_OF_WEEK.indexOf(selectedDay)
          const nextIndex = (currentIndex + 1) % 7
          setSelectedDay(DAYS_OF_WEEK[nextIndex])
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

