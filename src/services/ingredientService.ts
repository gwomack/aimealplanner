
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"
import { UseFormReturn } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

export const fetchExcludedIngredients = async (userId: string) => {
  const { data, error } = await supabase
    .from('excluded_ingredients')
    .select('ingredient')
    .eq('user_id', userId)

  if (error) throw error
  return data?.map(row => row.ingredient) || []
}

export const fetchWeeklyPlanIngredients = async () => {
  const { data, error } = await supabase
    .from('weekly_meal_plan_ingredients')
    .select(`
      ingredient_id:ingredients!weekly_meal_plan_ingredients_ingredient_id_fkey (
        name
      )
    `)

  if (error) throw error
  return data?.map(row => row.ingredient_id.name) || []
}

export const addIngredientToExcluded = async (ingredientName: string, userId: string) => {
  const { error } = await supabase
    .from('excluded_ingredients')
    .insert({
      ingredient: ingredientName,
      user_id: userId,
    })

  if (error) throw error
}

export const addIngredientToWeeklyPlan = async (
  ingredientName: string, 
  userId: string, 
  weeklyPlanId: string
) => {
  // Check if ingredient exists
  const { data: existingIngredient, error: checkError } = await supabase
    .from('ingredients')
    .select('id')
    .eq('name', ingredientName)
    .maybeSingle()

  if (checkError) throw checkError

  let ingredientId: string

  if (!existingIngredient) {
    const { data: newIngredientData, error: createError } = await supabase
      .from('ingredients')
      .insert({
        name: ingredientName,
        created_by: userId,
      })
      .select('id')
      .single()

    if (createError) throw createError
    ingredientId = newIngredientData.id
  } else {
    ingredientId = existingIngredient.id
  }

  const { error: relationError } = await supabase
    .from('weekly_meal_plan_ingredients')
    .insert({
      ingredient_id: ingredientId,
      weekly_plan_id: weeklyPlanId,
    })

  if (relationError) throw relationError
}

export const removeIngredientFromExcluded = async (ingredientName: string, userId: string) => {
  const { error } = await supabase
    .from('excluded_ingredients')
    .delete()
    .eq('ingredient', ingredientName)
    .eq('user_id', userId)

  if (error) throw error
}

export const removeIngredientFromWeeklyPlan = async (ingredientName: string, weeklyPlanId: string) => {
  const { data: ingredient, error: findError } = await supabase
    .from('ingredients')
    .select('id')
    .eq('name', ingredientName)
    .single()

  if (findError) throw findError
  if (!ingredient) throw new Error('Ingredient not found')

  const { error: deleteError } = await supabase
    .from('weekly_meal_plan_ingredients')
    .delete()
    .eq('ingredient_id', ingredient.id)
    .eq('weekly_plan_id', weeklyPlanId)

  if (deleteError) throw deleteError
}
