
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { DayNavigation } from "@/components/meal-plan/DayNavigation"
import { PlanParameters } from "@/components/meal-plan/PlanParameters"
import { MealCard } from "@/components/meal-plan/MealCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthProvider"

const MealPlanDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
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

  // Fetch ingredients
  const { data: ingredients } = useQuery({
    queryKey: ["weeklyPlanIngredients", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_meal_plan_ingredients")
        .select(`
          ingredients:ingredient_id (
            name
          )
        `)
        .eq("weekly_plan_id", id)

      if (error) throw error
      return data?.map(item => item.ingredients.name) || []
    },
  })

  // Fetch personal information
  const { data: personalInfo } = useQuery({
    queryKey: ["personalInfo", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_information")
        .select("*")
        .eq("user_id", session?.user.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!session?.user.id,
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

          <Card className="bg-[#1A1F2C] shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Ingredients</CardTitle>
              <CardDescription>Required ingredients for this meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ingredients?.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#221F26] text-muted-foreground border border-[#4ADE80]/20 hover:bg-[#2A262F] transition-colors"
                  >
                    {ingredient}
                  </span>
                ))}
                {!ingredients?.length && (
                  <div className="text-muted-foreground text-sm">No ingredients listed</div>
                )}
              </div>
            </CardContent>
          </Card>

          {personalInfo && (
            <Card className="bg-[#1A1F2C] shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {personalInfo.age && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#221F26] text-muted-foreground border border-[#8B5CF6]/20 mr-2">
                    Age: {personalInfo.age}
                  </div>
                )}
                {personalInfo.height && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#221F26] text-muted-foreground border border-[#D946EF]/20 mr-2">
                    Height: {personalInfo.height}cm
                  </div>
                )}
                {personalInfo.weight && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#221F26] text-muted-foreground border border-[#F97316]/20 mr-2">
                    Weight: {personalInfo.weight}kg
                  </div>
                )}
                {personalInfo.sex && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#221F26] text-muted-foreground border border-[#0EA5E9]/20">
                    Sex: {personalInfo.sex}
                  </div>
                )}
                {!personalInfo.age && !personalInfo.height && !personalInfo.weight && !personalInfo.sex && (
                  <div className="text-muted-foreground text-sm">No personal information available</div>
                )}
              </CardContent>
            </Card>
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

