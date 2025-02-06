
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
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
        const newIngredients = [...ingredientsList, newIngredientName]
        setIngredientsList(newIngredients)
        form.setValue(fieldName, newIngredients.join(','))
        setCurrentIngredient("")
      }
    }
  }

  return { currentIngredient, setCurrentIngredient, handleKeyDown }
}
