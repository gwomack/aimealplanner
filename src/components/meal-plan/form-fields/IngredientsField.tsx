
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"
import { DynamicIngredientInput } from "@/components/ingredients/DynamicIngredientInput"

interface IngredientsFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function IngredientsField({ form }: IngredientsFieldProps) {
  return (
    <DynamicIngredientInput
      form={form}
      fieldName="ingredients"
      label="Ingredients"
      tableName="weekly_meal_plan_ingredients"
      ingredientColumn="ingredient_id"
    />
  )
}
