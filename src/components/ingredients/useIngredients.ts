
import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"

export function useIngredients(
  form: UseFormReturn<any>,
  fieldName: string,
  tableName: keyof Database["public"]["Tables"],
  ingredientColumn: string,
  realtime: boolean
) {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [ingredientsList, setIngredientsList] = useState<string[]>([])

  const fetchIngredients = async () => {
    if (!session?.user.id) return

    try {
      if (tableName === 'excluded_ingredients') {
        const { data, error } = await supabase
          .from('excluded_ingredients')
          .select('ingredient')
          .eq('user_id', session.user.id)

        if (error) throw error

        if (data) {
          const ingredients = data.map(row => row.ingredient)
          setIngredientsList(ingredients)
          form.setValue(fieldName, ingredients.join(','))
        }
      } else if (tableName === 'weekly_meal_plan_ingredients') {
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
          form.setValue(fieldName, ingredients.join(','))
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
    if (!session?.user.id || !realtime) return

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
  }, [session?.user.id, tableName, realtime])

  useEffect(() => {
    if (realtime) {
      fetchIngredients()
    }
  }, [session?.user.id, realtime])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newIngredientName = currentIngredient.trim().toLowerCase()
      
      if (newIngredientName && !ingredientsList.includes(newIngredientName)) {
        if (realtime) {
          try {
            if (tableName === 'excluded_ingredients') {
              const { error } = await supabase
                .from('excluded_ingredients')
                .insert({
                  ingredient: newIngredientName,
                  user_id: session?.user.id as string,
                })

              if (error) throw error
            } else if (tableName === 'weekly_meal_plan_ingredients') {
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
        } else {
          const newIngredients = [...ingredientsList, newIngredientName]
          setIngredientsList(newIngredients)
          form.setValue(fieldName, newIngredients.join(','))
          setCurrentIngredient("")
        }
      }
    }
  }

  const removeIngredient = async (ingredientToRemove: string) => {
    if (!session?.user.id) return

    if (realtime) {
      try {
        if (tableName === 'excluded_ingredients') {
          const { error } = await supabase
            .from('excluded_ingredients')
            .delete()
            .eq('ingredient', ingredientToRemove)
            .eq('user_id', session.user.id)

          if (error) throw error
        } else if (tableName === 'weekly_meal_plan_ingredients') {
          const { data: ingredient, error: findError } = await supabase
            .from('ingredients')
            .select('id')
            .eq('name', ingredientToRemove)
            .single()

          if (findError) throw findError
          if (!ingredient) throw new Error('Ingredient not found')

          const { error: deleteError } = await supabase
            .from('weekly_meal_plan_ingredients')
            .delete()
            .eq('ingredient_id', ingredient.id)
            .eq('weekly_plan_id', form.getValues().weekly_plan_id)

          if (deleteError) throw deleteError
        }

        await fetchIngredients()

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
    } else {
      const updatedIngredients = ingredientsList.filter(ing => ing !== ingredientToRemove)
      setIngredientsList(updatedIngredients)
      form.setValue(fieldName, updatedIngredients.join(','))
    }
  }

  return {
    currentIngredient,
    setCurrentIngredient,
    ingredientsList,
    handleKeyDown,
    removeIngredient,
  }
}
