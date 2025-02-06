
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

type TableNames = keyof Database["public"]["Tables"]

interface DynamicIngredientInputProps {
  form: UseFormReturn<any>
  fieldName: string
  label: string
  tableName: TableNames
  ingredientColumn?: string
}

type IngredientData = {
  id: string
  ingredient: string
  user_id: string
  created_at: string
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

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `user_id=eq.${session.user.id}`,
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

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq("user_id", session.user.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching ingredients",
        description: error.message,
      })
    } else if (data) {
      const ingredients = data.map(item => item[ingredientColumn] as string)
      setIngredientsList(ingredients)
      form.setValue(fieldName, ingredients)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [session?.user.id])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newIngredient = currentIngredient.trim().toLowerCase()
      
      if (newIngredient && !ingredientsList.includes(newIngredient)) {
        try {
          const { error } = await supabase
            .from(tableName)
            .insert({
              user_id: session?.user.id,
              [ingredientColumn]: newIngredient,
            })

          if (error) throw error

          // Clear input after successful insertion
          setCurrentIngredient("")
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
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("user_id", session.user.id)
        .eq(ingredientColumn, ingredientToRemove)

      if (error) throw error

      // Show success toast
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
