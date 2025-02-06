
import { UseFormReturn } from "react-hook-form"
import { Database } from "@/integrations/supabase/types"
import { useIngredientsFetch } from "./hooks/useIngredientsFetch"
import { useIngredientsAdd } from "./hooks/useIngredientsAdd"
import { useIngredientsRemove } from "./hooks/useIngredientsRemove"

export function useIngredients(
  form: UseFormReturn<any>,
  fieldName: string,
  tableName: keyof Database["public"]["Tables"],
  ingredientColumn: string,
  realtime: boolean
) {
  const { ingredientsList, setIngredientsList, fetchIngredients } = useIngredientsFetch(
    form,
    fieldName,
    tableName,
    realtime
  )

  const { currentIngredient, setCurrentIngredient, handleKeyDown } = useIngredientsAdd(
    form,
    fieldName,
    tableName,
    ingredientsList,
    setIngredientsList,
    fetchIngredients
  )

  const { removeIngredient } = useIngredientsRemove(
    form,
    fieldName,
    tableName,
    ingredientsList,
    setIngredientsList,
    fetchIngredients
  )

  return {
    currentIngredient,
    setCurrentIngredient,
    ingredientsList,
    handleKeyDown,
    removeIngredient,
  }
}
