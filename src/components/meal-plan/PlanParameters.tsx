
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
    <Card>
      <CardHeader>
        <CardTitle>Meal Plan Parameters</CardTitle>
        <CardDescription>Generated meal plan settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Diet Type: </span>
          {mealPreferences.diet_type}
        </div>
        <div>
          <span className="font-medium">Health Goal: </span>
          {mealPreferences.health_goal}
        </div>
        <div>
          <span className="font-medium">Meals per Day: </span>
          {mealPreferences.meals_per_day}
        </div>
        <div>
          <span className="font-medium">Activity Level: </span>
          {mealPreferences.activity_level}
        </div>
      </CardContent>
    </Card>
  )
}

