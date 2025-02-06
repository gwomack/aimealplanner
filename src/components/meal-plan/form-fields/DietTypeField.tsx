
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"

interface DietTypeFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function DietTypeField({ form }: DietTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="dietType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Diet Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-popover">
                <SelectValue placeholder="Select your diet type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Anything">Anything</SelectItem>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Pescatarian">Pescatarian</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Ketogenic">Ketogenic</SelectItem>
              <SelectItem value="Paleo">Paleo</SelectItem>
              <SelectItem value="Mediterranean">Mediterranean</SelectItem>
              <SelectItem value="Low Carb">Low Carb</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
