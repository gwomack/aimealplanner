
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { DayNavigation } from "@/components/meal-plan/DayNavigation"
import { PlanParameters } from "@/components/meal-plan/PlanParameters"
import { MealCard } from "@/components/meal-plan/MealCard"

const MealPlanDetail = () => {
  const { id } = useParams<{ id: string }>()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState<string>(today)

  // Fetch weekly plan details
  const { data: weeklyPlan } = useQuery({
    queryKey: ["weeklyPlan", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_meal_plans")
        .select(`
          *,
          meal_preferences:meal_preference_id (
            diet_type,
            health_goal,
            meals_per_day,
            activity_level
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    },
  })

  // Fetch daily meals
  const { data: dailyPlan } = useQuery({
    queryKey: ["dailyPlan", id, selectedDay],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_meal_plans")
        .select("*")
        .eq("weekly_plan_id", id)
        .eq("day_of_week", selectedDay)
        .single()

      if (error) throw error
      return data
    },
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">{weeklyPlan?.name || 'Loading...'}</h1>
      
      <DayNavigation selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          {weeklyPlan?.meal_preferences && (
            <PlanParameters mealPreferences={weeklyPlan.meal_preferences} />
          )}
        </div>

        <div className="space-y-4">
          {dailyPlan?.meals?.map((meal: any, index: number) => (
            <MealCard key={index} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MealPlanDetail
