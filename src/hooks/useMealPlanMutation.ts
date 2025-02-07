
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { z } from "zod"

export const mealPlanFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dietType: z.enum([
    "Anything",
    "Vegetarian",
    "Pescatarian",
    "Vegan",
    "Ketogenic",
    "Paleo",
    "Mediterranean",
    "Low Carb",
  ]),
  healthGoal: z.enum(["build muscle", "lose weight", "eat healthy"]),
  mealsPerDay: z.enum(["2", "3", "4", "5", "6"]),
  ingredients: z.string().optional(),
})

export type MealPlanFormData = z.infer<typeof mealPlanFormSchema>

export function useMealPlanMutation() {
  const { session } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (values: MealPlanFormData) => {
      if (!session?.user.id) throw new Error("User not authenticated")

      // First create the weekly plan
      const { data: weeklyPlan, error: weeklyPlanError } = await supabase
        .from("weekly_meal_plans")
        .insert({
          name: values.name,
          user_id: session.user.id,
        })
        .select()
        .single()

      if (weeklyPlanError) throw weeklyPlanError

      // Store the preferences
      const { error: prefError } = await supabase
        .from("meal_preferences")
        .insert({
          user_id: session.user.id,
          diet_type: values.dietType,
          health_goal: values.healthGoal,
          meals_per_day: parseInt(values.mealsPerDay),
        })

      if (prefError) throw prefError

      // If ingredients were entered, process them
      if (values.ingredients) {
        const ingredientsList = values.ingredients
          .split(",")
          .map(i => i.trim())
          .filter(i => i.length > 0)

        for (const ingredientName of ingredientsList) {
          // Check if ingredient exists
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingredientName)
            .maybeSingle()

          let ingredientId
          if (!existingIngredient) {
            // Create new ingredient
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({
                name: ingredientName,
                created_by: session.user.id,
              })
              .select()
              .single()

            if (ingredientError) throw ingredientError
            ingredientId = newIngredient.id
          } else {
            ingredientId = existingIngredient.id
          }

          // Link ingredient to weekly plan
          const { error: linkError } = await supabase
            .from('weekly_meal_plan_ingredients')
            .insert({
              weekly_plan_id: weeklyPlan.id,
              ingredient_id: ingredientId,
            })

          if (linkError) throw linkError
        }
      }

      // Generate meal plan using Gemini
      const { data: mealPlanResponse, error: mealPlanGenError } = await supabase.functions
        .invoke('generate-meal-plan', {
          body: {
            weeklyPlanId: weeklyPlan.id,
            preferences: {
              dietType: values.dietType,
              healthGoal: values.healthGoal,
              mealsPerDay: parseInt(values.mealsPerDay),
              ingredients: values.ingredients,
            }
          }
        })

      if (mealPlanGenError) throw mealPlanGenError

      return weeklyPlan
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your meal plan preferences have been saved and meals are being generated",
      })
      navigate("/plans")
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  })
}
