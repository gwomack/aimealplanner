
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { Database } from "@/integrations/supabase/types"
import { UseFormReturn } from "react-hook-form"
import { removeIngredientFromExcluded, removeIngredientFromWeeklyPlan } from "@/services/ingredientService"

export function useIngredientsRemove(
  form: UseFormReturn<any>,
  fieldName: string,
  tableName: keyof Database["public"]["Tables"],
  ingredientsList: string[],
  setIngredientsList: (value: string[]) => void,
  fetchIngredients: () => Promise<void>
) {
  const { session } = useAuth()
  const { toast } = useToast()

  const removeIngredient = async (ingredientToRemove: string) => {
    if (!session?.user.id) return

    try {
      if (tableName === 'excluded_ingredients') {
        await removeIngredientFromExcluded(ingredientToRemove, session.user.id)
        await fetchIngredients()
      } else if (tableName === 'weekly_meal_plan_ingredients') {
        await removeIngredientFromWeeklyPlan(
          ingredientToRemove,
          form.getValues().weekly_plan_id
        )
        await fetchIngredients()
      } else {
        const updatedIngredients = ingredientsList.filter(ing => ing !== ingredientToRemove)
        setIngredientsList(updatedIngredients)
        form.setValue(fieldName, updatedIngredients.join(','))
      }

      toast({
        title: "Success",
        description: "Ingredient removed successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing ingredient",
        description: error.message,
      })
    }
  }

  return { removeIngredient }
}
