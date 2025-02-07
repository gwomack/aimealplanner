
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, UtensilsCrossed, Flame, Dumbbell, Beef, Cookie } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const MealPlanDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedDay, setSelectedDay] = useState<string>("Monday")

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
      {/* Days Navigation */}
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
                "px-3 py-1 text-sm",
                day === selectedDay && "bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white"
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

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Left Column - Plan Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meal Plan Parameters</CardTitle>
              <CardDescription>Generated meal plan settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {weeklyPlan?.meal_preferences && (
                <>
                  <div>
                    <span className="font-medium">Diet Type: </span>
                    {weeklyPlan.meal_preferences.diet_type}
                  </div>
                  <div>
                    <span className="font-medium">Health Goal: </span>
                    {weeklyPlan.meal_preferences.health_goal}
                  </div>
                  <div>
                    <span className="font-medium">Meals per Day: </span>
                    {weeklyPlan.meal_preferences.meals_per_day}
                  </div>
                  <div>
                    <span className="font-medium">Activity Level: </span>
                    {weeklyPlan.meal_preferences.activity_level}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Daily Meals */}
        <div className="space-y-4">
          {dailyPlan?.meals?.map((meal: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge 
                    className={cn(
                      "text-white px-3 py-1",
                      meal.type === "breakfast" && "bg-[#F97316]",
                      meal.type === "lunch" && "bg-[#D946EF]",
                      meal.type === "dinner" && "bg-[#8B5CF6]",
                      meal.type === "snack" && "bg-[#9b87f5]"
                    )}
                  >
                    <UtensilsCrossed className="w-3 h-3 mr-1" />
                    {meal.type}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6]">
                  {meal.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="outline" className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white border-none">
                    <Flame className="w-3 h-3 mr-1" />
                    {meal.calories} calories
                  </Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white border-none">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    {meal.protein}g protein
                  </Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-[#8B5CF6] to-[#F97316] text-white border-none">
                    <Cookie className="w-3 h-3 mr-1" />
                    {meal.carbs}g carbs
                  </Badge>
                  <Badge variant="outline" className="bg-gradient-to-r from-[#F97316] to-[#8B5CF6] text-white border-none">
                    <Beef className="w-3 h-3 mr-1" />
                    {meal.fat}g fat
                  </Badge>
                </div>
                <p className="mt-4 text-muted-foreground">{meal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MealPlanDetail

