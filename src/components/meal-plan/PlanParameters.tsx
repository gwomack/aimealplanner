
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MealPreferences {
  diet_type: string
  health_goal: string
  meals_per_day: number
  activity_level: string
}

interface PlanParametersProps {
  mealPreferences: MealPreferences
}

export const PlanParameters = ({ mealPreferences }: PlanParametersProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#9b87f5] to-[#D6BCFA] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Meal Plan Parameters</CardTitle>
        <CardDescription className="text-white/80">Generated meal plan settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <span className="font-medium text-white">Diet Type: </span>
          <span className="text-white/90">{mealPreferences.diet_type}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <span className="font-medium text-white">Health Goal: </span>
          <span className="text-white/90">{mealPreferences.health_goal}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <span className="font-medium text-white">Meals per Day: </span>
          <span className="text-white/90">{mealPreferences.meals_per_day}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <span className="font-medium text-white">Activity Level: </span>
          <span className="text-white/90">{mealPreferences.activity_level}</span>
        </div>
      </CardContent>
    </Card>
  )
}
