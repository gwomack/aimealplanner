
import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Database } from "@/integrations/supabase/types"
import { fetchExcludedIngredients, fetchWeeklyPlanIngredients } from "@/services/ingredientService"

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
      let ingredients: string[] = []
      
      if (tableName === 'excluded_ingredients') {
        ingredients = await fetchExcludedIngredients(session.user.id)
      } else if (tableName === 'weekly_meal_plan_ingredients') {
        ingredients = await fetchWeeklyPlanIngredients()
      }

      setIngredientsList(ingredients)
      form.setValue(fieldName, ingredients.join(','))
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
