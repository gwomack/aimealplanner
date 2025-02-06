
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"

interface IngredientInputProps {
  form: UseFormReturn<any>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function IngredientInput({ form, value, onChange }: IngredientInputProps) {
  return (
    <FormField
      control={form.control}
      name="excludedIngredients"
      render={() => (
        <FormItem className="space-y-1.5">
          <FormLabel>Excluded Ingredients</FormLabel>
          <FormControl>
            <Input
              value={value}
              onChange={onChange}
              placeholder="Type ingredient and press comma to add"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
