
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { NameField } from "./form-fields/NameField"
import { DietTypeField } from "./form-fields/DietTypeField"
import { HealthGoalField } from "./form-fields/HealthGoalField"
import { MealsPerDayField } from "./form-fields/MealsPerDayField"
import { IngredientsField } from "./form-fields/IngredientsField"
import { useMealPlanMutation, mealPlanFormSchema, type MealPlanFormData } from "@/hooks/useMealPlanMutation"

export function CreatePlanForm() {
  const form = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: {
      name: "",
      dietType: "Anything",
      healthGoal: "eat healthy",
      mealsPerDay: "3",
      ingredients: "",
    },
  })

  const createPlan = useMealPlanMutation()

  function onSubmit(values: MealPlanFormData) {
    createPlan.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <NameField form={form} />
        <DietTypeField form={form} />
        <HealthGoalField form={form} />
        <MealsPerDayField form={form} />
        <IngredientsField form={form} />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90"
          disabled={createPlan.isPending}
        >
          {createPlan.isPending ? "Creating..." : "Create Plan"}
        </Button>
      </form>
    </Form>
  )
}
