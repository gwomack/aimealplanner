
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
    <Card className="bg-[#1A1F2C] shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Meal Plan Parameters</CardTitle>
        <CardDescription>Generated meal plan settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-[#221F26] rounded-lg p-3 shadow-sm border border-[#8B5CF6]/20">
          <span className="font-medium text-[#8B5CF6]">Diet Type: </span>
          <span className="text-muted-foreground">{mealPreferences.diet_type}</span>
        </div>
        <div className="bg-[#221F26] rounded-lg p-3 shadow-sm border border-[#D946EF]/20">
          <span className="font-medium text-[#D946EF]">Health Goal: </span>
          <span className="text-muted-foreground">{mealPreferences.health_goal}</span>
        </div>
        <div className="bg-[#221F26] rounded-lg p-3 shadow-sm border border-[#F97316]/20">
          <span className="font-medium text-[#F97316]">Meals per Day: </span>
          <span className="text-muted-foreground">{mealPreferences.meals_per_day}</span>
        </div>
        <div className="bg-[#221F26] rounded-lg p-3 shadow-sm border border-[#0EA5E9]/20">
          <span className="font-medium text-[#0EA5E9]">Activity Level: </span>
          <span className="text-muted-foreground">{mealPreferences.activity_level}</span>
        </div>
      </CardContent>
    </Card>
  )
}
