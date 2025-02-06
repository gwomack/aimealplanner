
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"

interface MealsPerDayFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function MealsPerDayField({ form }: MealsPerDayFieldProps) {
  return (
    <FormField
      control={form.control}
      name="mealsPerDay"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Meals Per Day</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-popover">
                <SelectValue placeholder="Select number of meals" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="2">2 meals</SelectItem>
              <SelectItem value="3">3 meals</SelectItem>
              <SelectItem value="4">4 meals</SelectItem>
              <SelectItem value="5">5 meals</SelectItem>
              <SelectItem value="6">6 meals</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
