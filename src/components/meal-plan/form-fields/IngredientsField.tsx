
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"

interface IngredientsFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function IngredientsField({ form }: IngredientsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="ingredients"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ingredients</FormLabel>
          <FormControl>
            <Input
              placeholder="Type ingredients separated by commas"
              {...field}
              className="bg-popover"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
