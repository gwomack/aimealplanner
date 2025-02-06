
import { UseFormReturn } from "react-hook-form"
import { DynamicIngredientInput } from "@/components/ingredients/DynamicIngredientInput"

interface ExcludedIngredientsFormProps {
  form: UseFormReturn<any>
}

export function ExcludedIngredientsForm({ form }: ExcludedIngredientsFormProps) {
  return (
    <DynamicIngredientInput
      form={form}
      fieldName="excludedIngredients"
      label="Excluded Ingredients"
      tableName="excluded_ingredients"
    />
  )
}
