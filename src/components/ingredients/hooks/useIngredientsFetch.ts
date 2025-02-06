
import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"

export function useIngredientsFetch(
  form: UseFormReturn<any>,
  fieldName: string,
  tableName: keyof Database["public"]["Tables"],
  realtime: boolean
) {
  const { session } = useAuth()
  const { toast } = useToast()
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

  return { ingredientsList, setIngredientsList, fetchIngredients }
}
