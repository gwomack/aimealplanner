
import { useState } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { type Ingredient } from "./types"

const ITEMS_PER_PAGE = 15

export function useIngredientsData() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newIngredient, setNewIngredient] = useState("")
  const [ingredientSearch, setIngredientSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch ingredients with search and pagination
  const { data: ingredientsData } = useQuery({
    queryKey: ["ingredients", ingredientSearch, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("ingredients")
        .select(`
          *,
          ingredients_to_tags (
            tag_id,
            ingredients_tags (
              name
            )
          )
        `, { count: 'exact' })
        .order('name')
        
      if (ingredientSearch) {
        query = query.ilike('name', `%${ingredientSearch}%`)
      }
      
      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1
      
      const { data, error, count } = await query.range(from, to)
      
      if (error) throw error
      return { items: data as Ingredient[], total: count || 0 }
    },
  })

  // Add ingredient mutation
  const addIngredient = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("No user")
      const { error } = await supabase
        .from("ingredients")
        .insert({ name: newIngredient, created_by: session.user.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      setNewIngredient("")
      toast({
        title: "Success",
        description: "Ingredient added successfully",
      })
    },
  })

  // Delete ingredient mutation
  const deleteIngredient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ingredients")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      toast({
        title: "Success",
        description: "Ingredient deleted successfully",
      })
    },
  })

  // Remove tag from ingredient mutation
  const removeTagFromIngredient = useMutation({
    mutationFn: async ({ ingredientId, tagId }: { ingredientId: string; tagId: string }) => {
      const { error } = await supabase
        .from("ingredients_to_tags")
        .delete()
        .eq("ingredient_id", ingredientId)
        .eq("tag_id", tagId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      toast({
        title: "Success",
        description: "Tag removed from ingredient",
      })
    },
  })

  return {
    ingredientsData,
    newIngredient,
    setNewIngredient,
    ingredientSearch,
    setIngredientSearch,
    currentPage,
    setCurrentPage,
    addIngredient,
    deleteIngredient,
    removeTagFromIngredient,
    ITEMS_PER_PAGE,
  }
}
