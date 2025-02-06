
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"
import { UseFormReturn } from "react-hook-form"

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

    if (tableName === 'excluded_ingredients') {
      try {
        const { error } = await supabase
          .from('excluded_ingredients')
          .delete()
          .eq('ingredient', ingredientToRemove)
          .eq('user_id', session.user.id)

        if (error) throw error

        await fetchIngredients()

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
    } else if (tableName === 'weekly_meal_plan_ingredients') {
      try {
        const { data: ingredient, error: findError } = await supabase
          .from('ingredients')
          .select('id')
          .eq('name', ingredientToRemove)
          .single()

        if (findError) throw findError
        if (!ingredient) throw new Error('Ingredient not found')

        const { error: deleteError } = await supabase
          .from('weekly_meal_plan_ingredients')
          .delete()
          .eq('ingredient_id', ingredient.id)
          .eq('weekly_plan_id', form.getValues().weekly_plan_id)

        if (deleteError) throw deleteError

        await fetchIngredients()

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
    } else {
      const updatedIngredients = ingredientsList.filter(ing => ing !== ingredientToRemove)
      setIngredientsList(updatedIngredients)
      form.setValue(fieldName, updatedIngredients.join(','))
    }
  }

  return { removeIngredient }
}
