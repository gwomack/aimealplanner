
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { Database } from "@/integrations/supabase/types"
import { addIngredientToExcluded, addIngredientToWeeklyPlan } from "@/services/ingredientService"

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
        try {
          if (tableName === 'excluded_ingredients') {
            await addIngredientToExcluded(newIngredientName, session?.user.id as string)
            setCurrentIngredient("")
            await fetchIngredients()
          } else if (tableName === 'weekly_meal_plan_ingredients') {
            await addIngredientToWeeklyPlan(
              newIngredientName, 
              session?.user.id as string,
              form.getValues().weekly_plan_id
            )
            setCurrentIngredient("")
            await fetchIngredients()
          } else {
            const newIngredients = [...ingredientsList, newIngredientName]
            setIngredientsList(newIngredients)
            form.setValue(fieldName, newIngredients.join(','))
            setCurrentIngredient("")
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error adding ingredient",
            description: error.message,
          })
        }
      }
    }
  }

  return { currentIngredient, setCurrentIngredient, handleKeyDown }
}
