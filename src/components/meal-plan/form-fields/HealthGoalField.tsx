
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"

interface HealthGoalFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function HealthGoalField({ form }: HealthGoalFieldProps) {
  return (
    <FormField
      control={form.control}
      name="healthGoal"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Health Goal</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-popover">
                <SelectValue placeholder="Select your health goal" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="build muscle">Build Muscle</SelectItem>
              <SelectItem value="lose weight">Lose Weight</SelectItem>
              <SelectItem value="eat healthy">Eat Healthy</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
