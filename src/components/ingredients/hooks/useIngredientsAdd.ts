
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"

export function useIngredientsAdd(
  form: UseFormReturn<any>,
  fieldName: string,
  tableName: keyof Database["public"]["Tables"],
  ingredientsList: string[],
  setIngredientsList: (value: string[]) => void,
  fetchIngredients: () => Promise<void>
) {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentIngredient, setCurrentIngredient] = useState("")

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newIngredientName = currentIngredient.trim().toLowerCase()
      
      if (newIngredientName && !ingredientsList.includes(newIngredientName)) {
        if (tableName === 'excluded_ingredients') {
          try {
            const { error } = await supabase
              .from('excluded_ingredients')
              .insert({
                ingredient: newIngredientName,
                user_id: session?.user.id as string,
              })

            if (error) throw error
            setCurrentIngredient("")
            await fetchIngredients()
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Error adding ingredient",
              description: error.message,
            })
          }
        } else if (tableName === 'weekly_meal_plan_ingredients') {
          try {
            const { data: existingIngredient, error: checkError } = await supabase
              .from('ingredients')
              .select('id')
              .eq('name', newIngredientName)
              .maybeSingle()

            if (checkError) throw checkError

            let ingredientId: string

            if (!existingIngredient) {
              const { data: newIngredientData, error: createError } = await supabase
                .from('ingredients')
                .insert({
                  name: newIngredientName,
                  created_by: session?.user.id as string,
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
                weekly_plan_id: form.getValues().weekly_plan_id,
              })

            if (relationError) throw relationError
            setCurrentIngredient("")
            await fetchIngredients()
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Error adding ingredient",
              description: error.message,
            })
          }
        } else {
          const newIngredients = [...ingredientsList, newIngredientName]
          setIngredientsList(newIngredients)
          form.setValue(fieldName, newIngredients.join(','))
          setCurrentIngredient("")
        }
      }
    }
  }

  return { currentIngredient, setCurrentIngredient, handleKeyDown }
}
