
export type Meal = {
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
}

export type DayPlan = {
  day: string
  meals: Meal[]
}

export type MealPlan = {
  days: DayPlan[]
}

export type GenerateMealPlanRequest = {
  weeklyPlanId: string
  preferences: {
    dietType: string
    healthGoal: string
    mealsPerDay: string
    ingredients?: string
  }
}
