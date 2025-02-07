
import { UseFormReturn } from "react-hook-form"

export type Ingredient = {
  id: string
  name: string
  created_at: string
  created_by: string
  ingredients_to_tags?: Array<{
    tag_id: string
    ingredients_tags: {
      name: string
    }
  }>
}

export type Tag = {
  id: string
  name: string
  created_by: string
}

export interface IngredientBadgeProps {
  ingredient: string
  onRemove: (ingredient: string) => void
}

export interface IngredientInputProps {
  currentIngredient: string
  setCurrentIngredient: (value: string) => void
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  label: string
  form: UseFormReturn<any>
  fieldName: string
}

export interface DynamicIngredientInputProps {
  form: UseFormReturn<any>
  fieldName: string
  label: string
  tableName: string
  ingredientColumn?: string
  realtime?: boolean
}
