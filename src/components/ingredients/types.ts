
import { UseFormReturn } from "react-hook-form"
import { Database } from "@/integrations/supabase/types"

export interface DynamicIngredientInputProps {
  form: UseFormReturn<any>
  fieldName: string
  label: string
  tableName: keyof Database["public"]["Tables"]
  ingredientColumn?: string
  realtime?: boolean
}

export interface IngredientBadgeProps {
  ingredient: string
  onRemove: (ingredient: string) => void
}

export interface IngredientInputProps {
  currentIngredient: string
  setCurrentIngredient: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  label: string
  form: UseFormReturn<any>
  fieldName: string
}
