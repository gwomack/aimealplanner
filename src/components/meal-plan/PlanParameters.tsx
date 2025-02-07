
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
    <Card className="bg-card border-border/40 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Meal Plan Parameters</CardTitle>
        <CardDescription>Generated meal plan settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-muted rounded-lg p-3 shadow-sm">
          <span className="font-medium text-foreground">Diet Type: </span>
          <span className="text-muted-foreground">{mealPreferences.diet_type}</span>
        </div>
        <div className="bg-muted rounded-lg p-3 shadow-sm">
          <span className="font-medium text-foreground">Health Goal: </span>
          <span className="text-muted-foreground">{mealPreferences.health_goal}</span>
        </div>
        <div className="bg-muted rounded-lg p-3 shadow-sm">
          <span className="font-medium text-foreground">Meals per Day: </span>
          <span className="text-muted-foreground">{mealPreferences.meals_per_day}</span>
        </div>
        <div className="bg-muted rounded-lg p-3 shadow-sm">
          <span className="font-medium text-foreground">Activity Level: </span>
          <span className="text-muted-foreground">{mealPreferences.activity_level}</span>
        </div>
      </CardContent>
    </Card>
  )
}
