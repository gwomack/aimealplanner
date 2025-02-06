
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"

interface PersonalDetailsFormProps {
  form: UseFormReturn<any>
}

export function PersonalDetailsForm({ form }: PersonalDetailsFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="0" max="150" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel>Height (cm)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" min="0" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel>Sex</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sex" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
