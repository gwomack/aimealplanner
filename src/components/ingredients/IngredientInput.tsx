
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { IngredientInputProps } from "./types"

export function IngredientInput({
  currentIngredient,
  setCurrentIngredient,
  handleKeyDown,
  label,
  form,
  fieldName,
}: IngredientInputProps) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type ingredient and press Enter or comma to add"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
