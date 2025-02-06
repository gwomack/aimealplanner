
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthProvider"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dietType: z.enum([
    "Anything",
    "Vegetarian",
    "Pescatarian",
    "Vegan",
    "Ketogenic",
    "Paleo",
    "Mediterranean",
    "Low Carb",
  ]),
  healthGoal: z.enum(["build muscle", "lose weight", "eat healthy"]),
  mealsPerDay: z.enum(["2", "3", "4", "5", "6"]),
  ingredients: z.string().optional(),
})

export function CreatePlanForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dietType: "Anything",
      healthGoal: "eat healthy",
      mealsPerDay: "3",
      ingredients: "",
    },
  })

  const createPlan = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user.id) throw new Error("User not authenticated")

      // First create the weekly plan
      const { data: weeklyPlan, error: weeklyPlanError } = await supabase
        .from("weekly_meal_plans")
        .insert({
          name: values.name,
          user_id: session.user.id,
        })
        .select()
        .single()

      if (weeklyPlanError) throw weeklyPlanError

      // Store the preferences
      const { error: prefError } = await supabase
        .from("meal_preferences")
        .insert({
          user_id: session.user.id,
          diet_type: values.dietType,
          health_goal: values.healthGoal,
          meals_per_day: parseInt(values.mealsPerDay),
        })

      if (prefError) throw prefError

      // If ingredients were entered, process them
      if (values.ingredients) {
        const ingredientsList = values.ingredients
          .split(",")
          .map(i => i.trim())
          .filter(i => i.length > 0)

        for (const ingredientName of ingredientsList) {
          // Check if ingredient exists
          const { data: existingIngredient } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingredientName)
            .maybeSingle()

          let ingredientId
          if (!existingIngredient) {
            // Create new ingredient
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({
                name: ingredientName,
                created_by: session.user.id,
              })
              .select()
              .single()

            if (ingredientError) throw ingredientError
            ingredientId = newIngredient.id
          } else {
            ingredientId = existingIngredient.id
          }

          // Link ingredient to weekly plan
          const { error: linkError } = await supabase
            .from('weekly_meal_plan_ingredients')
            .insert({
              weekly_plan_id: weeklyPlan.id,
              ingredient_id: ingredientId,
            })

          if (linkError) throw linkError
        }
      }

      return weeklyPlan
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Your meal plan preferences have been saved",
      })
      navigate("/plans")
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPlan.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
