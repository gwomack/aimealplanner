
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { useQuery } from "@tanstack/react-query"

interface PersonalInfoFormValues {
  age: string
  weight: string
  height: string
  sex: string
  excludedIngredients: string
}

export function PersonalInfoForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [excludedIngredientsList, setExcludedIngredientsList] = useState<string[]>([])

  const form = useForm<PersonalInfoFormValues>({
    defaultValues: {
      age: "",
      weight: "",
      height: "",
      sex: "",
      excludedIngredients: "",
    },
  })

  // Fetch personal information and excluded ingredients
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const { data: personalData, error: personalError } = await supabase
        .from("personal_information")
        .select("age, weight, height, sex")
        .eq("user_id", session?.user.id)
        .maybeSingle()

      if (personalError && personalError.code !== "PGRST116") {
        toast({
          variant: "destructive",
          title: "Error fetching personal information",
          description: personalError.message,
        })
        return null
      }

      // Fetch excluded ingredients
      const { data: excludedData, error: excludedError } = await supabase
        .from("excluded_ingredients")
        .select("ingredient_id, ingredients(name)")
        .eq("user_id", session?.user.id)

      if (excludedError) {
        toast({
          variant: "destructive",
          title: "Error fetching excluded ingredients",
          description: excludedError.message,
        })
      } else if (excludedData) {
        const ingredientNames = excludedData.map(
          (item: any) => item.ingredients.name
        )
        setExcludedIngredientsList(ingredientNames)
      }

      if (personalData) {
        form.setValue("age", personalData.age?.toString() || "")
        form.setValue("weight", personalData.weight?.toString() || "")
        form.setValue("height", personalData.height?.toString() || "")
        form.setValue("sex", personalData.sex || "")
      }

      return personalData
    },
    enabled: !!session,
  })

  const onSubmit = async (data: PersonalInfoFormValues) => {
    setLoading(true)

    try {
      // Update personal information
      const { error: personalError } = await supabase
        .from("personal_information")
        .upsert({
          user_id: session?.user.id,
          age: parseInt(data.age) || null,
          weight: parseFloat(data.weight) || null,
          height: parseFloat(data.height) || null,
          sex: data.sex || null,
        })

      if (personalError) throw personalError

      // Handle excluded ingredients
      if (data.excludedIngredients) {
        const ingredients = data.excludedIngredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i)

        // First, insert new ingredients if they don't exist
        for (const ingredient of ingredients) {
          const { data: existingIngredient } = await supabase
            .from("ingredients")
            .select("id")
            .eq("name", ingredient.toLowerCase())
            .maybeSingle()

          let ingredientId = existingIngredient?.id

          if (!ingredientId) {
            const { data: newIngredient, error: insertError } = await supabase
              .from("ingredients")
              .insert({
                name: ingredient.toLowerCase(),
                created_by: session?.user.id,
              })
              .select("id")
              .single()

            if (insertError) throw insertError
            ingredientId = newIngredient.id
          }

          // Insert excluded ingredient
          const { error: excludeError } = await supabase
            .from("excluded_ingredients")
            .upsert({
              user_id: session?.user.id,
              ingredient_id: ingredientId,
            })

          if (excludeError) throw excludeError
        }

        setExcludedIngredientsList(ingredients)
      }

      toast({
        title: "Personal information updated",
        description: "Your personal information has been updated successfully.",
      })

      // Clear the excluded ingredients input
      form.setValue("excludedIngredients", "")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating personal information",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="excludedIngredients"
          render={({ field }) => (
            <FormItem className="space-y-1.5 col-span-2">
              <FormLabel>Excluded Ingredients</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter ingredients separated by commas"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {excludedIngredientsList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {excludedIngredientsList.map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {ingredient}
              </Badge>
            ))}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Personal Information"}
        </Button>
      </form>
    </Form>
  )
}
