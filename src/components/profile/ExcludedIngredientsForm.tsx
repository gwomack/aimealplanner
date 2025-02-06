
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UseFormReturn } from "react-hook-form"
import { IngredientInput } from "./IngredientInput"
import { IngredientsList } from "./IngredientsList"

interface ExcludedIngredientsFormProps {
  form: UseFormReturn<any>
}

export function ExcludedIngredientsForm({ form }: ExcludedIngredientsFormProps) {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [excludedIngredientsList, setExcludedIngredientsList] = useState<string[]>([])

  useEffect(() => {
    if (!session?.user.id) return

    const channel = supabase
      .channel('excluded-ingredients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'excluded_ingredients',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Real-time update:', payload)
          fetchExcludedIngredients()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user.id])

  const fetchExcludedIngredients = async () => {
    if (!session?.user.id) return

    const { data: excludedData, error: excludedError } = await supabase
      .from("excluded_ingredients")
      .select("ingredient")
      .eq("user_id", session.user.id)

    if (excludedError) {
      toast({
        variant: "destructive",
        title: "Error fetching excluded ingredients",
        description: excludedError.message,
      })
    } else if (excludedData) {
      const ingredients = excludedData.map((item) => item.ingredient)
      setExcludedIngredientsList(ingredients)
    }
  }

  useEffect(() => {
    fetchExcludedIngredients()
  }, [session?.user.id])

  const handleIngredientInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentIngredient(value)

    if (value.endsWith(",")) {
      const newIngredient = value.slice(0, -1).trim().toLowerCase()
      if (newIngredient && !excludedIngredientsList.includes(newIngredient)) {
        setExcludedIngredientsList([...excludedIngredientsList, newIngredient])
      }
      setCurrentIngredient("")
    }
  }

  const removeIngredient = async (ingredientToRemove: string) => {
    if (!session?.user.id) return

    try {
      const { error } = await supabase
        .from("excluded_ingredients")
        .delete()
        .eq("user_id", session.user.id)
        .eq("ingredient", ingredientToRemove)

      if (error) throw error
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing ingredient",
        description: error.message,
      })
    }
  }

  return (
    <>
      <IngredientInput
        form={form}
        value={currentIngredient}
        onChange={handleIngredientInput}
      />
      <IngredientsList
        ingredients={excludedIngredientsList}
        onRemoveIngredient={removeIngredient}
      />
    </>
  )
}
