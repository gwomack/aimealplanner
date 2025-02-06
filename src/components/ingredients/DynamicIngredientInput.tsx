
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Database } from "@/integrations/supabase/types"

interface DynamicIngredientInputProps {
  form: UseFormReturn<any>
  fieldName: string
  label: string
  tableName: keyof Database["public"]["Tables"]
  ingredientColumn?: string
}

export function DynamicIngredientInput({
  form,
  fieldName,
  label,
  tableName,
  ingredientColumn = "ingredient"
}: DynamicIngredientInputProps) {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [ingredientsList, setIngredientsList] = useState<string[]>([])

  useEffect(() => {
    if (!session?.user.id) return

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        () => {
          fetchIngredients()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user.id, tableName])

  const fetchIngredients = async () => {
    if (!session?.user.id) return

    try {
      if (tableName === 'weekly_meal_plan_ingredients') {
        const { data, error } = await supabase
          .from('weekly_meal_plan_ingredients')
          .select(`
            ingredient_id:ingredients!weekly_meal_plan_ingredients_ingredient_id_fkey (
              name
            )
          `)

        if (error) throw error

        if (data) {
          const ingredients = data.map(row => row.ingredient_id.name)
          setIngredientsList(ingredients)
          form.setValue(fieldName, ingredients)
        }
      } else {
        const { data, error } = await supabase
          .from(tableName)
          .select()

        if (error) throw error

        if (data) {
          const ingredients = data.map(row => String(row[ingredientColumn]))
          setIngredientsList(ingredients)
          form.setValue(fieldName, ingredients)
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching ingredients",
        description: error.message,
      })
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [session?.user.id])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newIngredientName = currentIngredient.trim().toLowerCase()
      
      if (newIngredientName && !ingredientsList.includes(newIngredientName)) {
        try {
          // First create or get the ingredient from ingredients table
          const { data: existingIngredient, error: checkError } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', newIngredientName)
            .maybeSingle()

          if (checkError) throw checkError

          let ingredientId: string

          if (!existingIngredient) {
            const { data: newIngredientData, error: createError } = await supabase
              .from('ingredients')
              .insert({
                name: newIngredientName,
                created_by: session?.user.id as string,
              })
              .select('id')
              .single()

            if (createError) throw createError
            ingredientId = newIngredientData.id
          } else {
            ingredientId = existingIngredient.id
          }

          // Then handle the ingredient relationship based on table
          if (tableName === 'weekly_meal_plan_ingredients') {
            const { error: relationError } = await supabase
              .from('weekly_meal_plan_ingredients')
              .insert({
                ingredient_id: ingredientId,
                weekly_plan_id: form.getValues().weekly_plan_id,
              })

            if (relationError) throw relationError
          }

          setCurrentIngredient("")
          await fetchIngredients()
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error adding ingredient",
            description: error.message,
          })
        }
      }
    }
  }

  const removeIngredient = async (ingredientToRemove: string) => {
    if (!session?.user.id) return

    try {
      if (tableName === 'weekly_meal_plan_ingredients') {
        // First get the ingredient ID
        const { data: ingredient, error: findError } = await supabase
          .from('ingredients')
          .select('id')
          .eq('name', ingredientToRemove)
          .single()

        if (findError) throw findError
        if (!ingredient) throw new Error('Ingredient not found')

        // Remove from weekly_meal_plan_ingredients
        const { error: deleteError } = await supabase
          .from('weekly_meal_plan_ingredients')
          .delete()
          .eq('ingredient_id', ingredient.id)
          .eq('weekly_plan_id', form.getValues().weekly_plan_id)

        if (deleteError) throw deleteError
      } else {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(ingredientColumn, ingredientToRemove)

        if (error) throw error
      }

      const updatedIngredients = ingredientsList.filter(ing => ing !== ingredientToRemove)
      setIngredientsList(updatedIngredients)
      form.setValue(fieldName, updatedIngredients)

      toast({
        title: "Success",
        description: "Ingredient removed successfully",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing ingredient",
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={fieldName}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type ingredient and press Enter or comma to add"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {ingredientsList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredientsList.map((ingredient, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-sm flex items-center gap-1"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => removeIngredient(ingredient)}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
