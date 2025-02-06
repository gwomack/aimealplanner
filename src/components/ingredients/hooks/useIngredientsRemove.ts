
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
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

    const updatedIngredients = ingredientsList.filter(ing => ing !== ingredientToRemove)
    setIngredientsList(updatedIngredients)
    form.setValue(fieldName, updatedIngredients.join(','))

    toast({
      title: "Success",
      description: "Ingredient removed",
    })
  }

  return { removeIngredient }
}
