
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { MealPlanFormData } from "@/hooks/useMealPlanMutation"

interface NameFieldProps {
  form: UseFormReturn<MealPlanFormData>
}

export function NameField({ form }: NameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Plan Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter plan name" {...field} className="bg-popover" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
