
import { MealPlan, DayPlan, Meal } from "./types.ts"

export function validateMealPlan(mealPlan: MealPlan, expectedMealsPerDay: number): void {
  if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
    throw new Error('Invalid meal plan structure: missing days array')
  }

  if (mealPlan.days.length !== 7) {
    throw new Error(`Expected 7 days, got ${mealPlan.days.length}`)
  }

  for (const day of mealPlan.days) {
    validateDayPlan(day, expectedMealsPerDay)
  }
}

function validateDayPlan(day: DayPlan, expectedMealsPerDay: number): void {
  if (!day.day || !day.meals || !Array.isArray(day.meals)) {
    console.error('Invalid day structure:', day)
    throw new Error(`Invalid structure for day: ${day.day}`)
  }

  if (day.meals.length !== expectedMealsPerDay) {
    throw new Error(`Expected ${expectedMealsPerDay} meals for ${day.day}, got ${day.meals.length}`)
  }

  for (const meal of day.meals) {
    validateMeal(meal, day.day)
  }
}

function validateMeal(meal: Meal, dayName: string): void {
  if (typeof meal.name !== 'string' || meal.name.length === 0) {
    throw new Error(`Invalid or missing meal name in ${dayName}`)
  }
  if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.type)) {
    throw new Error(`Invalid meal type "${meal.type}" in ${dayName}`)
  }
  if (typeof meal.calories !== 'number' || meal.calories <= 0) {
    throw new Error(`Invalid calories value in ${dayName}`)
  }
  if (typeof meal.protein !== 'number' || meal.protein < 0) {
    throw new Error(`Invalid protein value in ${dayName}`)
  }
  if (typeof meal.carbs !== 'number' || meal.carbs < 0) {
    throw new Error(`Invalid carbs value in ${dayName}`)
  }
  if (typeof meal.fat !== 'number' || meal.fat < 0) {
    throw new Error(`Invalid fat value in ${dayName}`)
  }
  if (typeof meal.description !== 'string' || meal.description.length === 0) {
    throw new Error(`Invalid or missing meal description in ${dayName}`)
  }
}
