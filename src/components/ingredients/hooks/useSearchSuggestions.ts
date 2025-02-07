
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { type Ingredient } from "../types"

export function useSearchSuggestions() {
  const [ingredientSuggestions, setIngredientSuggestions] = useState<Ingredient[]>([])
  const [tagSuggestions, setTagSuggestions] = useState<{ id: string; name: string }[]>([])
  
  const searchIngredients = async (searchTerm: string) => {
    if (!searchTerm) {
      setIngredientSuggestions([])
      return
    }

    const { data, error } = await supabase
      .from("ingredients")
      .select(`
        *,
        ingredients_to_tags (
          tag_id,
          ingredients_tags (
            name
          )
        )
      `)
      .ilike("name", `%${searchTerm}%`)
      .limit(5)

    if (error) {
      console.error("Error searching ingredients:", error)
      return
    }

    setIngredientSuggestions(data as Ingredient[])
  }

  const searchTags = async (searchTerm: string) => {
    if (!searchTerm) {
      setTagSuggestions([])
      return
    }

    const { data, error } = await supabase
      .from("ingredients_tags")
      .select("id, name")
      .ilike("name", `%${searchTerm}%`)
      .limit(5)

    if (error) {
      console.error("Error searching tags:", error)
      return
    }

    setTagSuggestions(data)
  }

  return {
    ingredientSuggestions,
    tagSuggestions,
    searchIngredients,
    searchTags,
  }
}
