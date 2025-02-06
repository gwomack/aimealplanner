
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"

interface ExcludedIngredientsFormProps {
  form: UseFormReturn<any>
}

export function ExcludedIngredientsForm({ form }: ExcludedIngredientsFormProps) {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [excludedIngredientsList, setExcludedIngredientsList] = useState<string[]>([])

  // Subscribe to real-time updates for excluded ingredients
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

  // Function to fetch excluded ingredients
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

  // Initial fetch of excluded ingredients
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
      <FormField
        control={form.control}
        name="excludedIngredients"
        render={() => (
          <FormItem className="space-y-1.5">
            <FormLabel>Excluded Ingredients</FormLabel>
            <FormControl>
              <Input
                value={currentIngredient}
                onChange={handleIngredientInput}
                placeholder="Type ingredient and press comma to add"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {excludedIngredientsList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {excludedIngredientsList.map((ingredient, index) => (
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
    </>
  )
}
