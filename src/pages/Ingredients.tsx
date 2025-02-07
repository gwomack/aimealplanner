
import { useState } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Tag, Trash } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function Ingredients() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newIngredient, setNewIngredient] = useState("")
  const [newTag, setNewTag] = useState("")

  // Fetch ingredients (RLS will automatically filter to user's own ingredients)
  const { data: ingredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select(`
          id,
          name,
          ingredients_to_tags (
            tag_id,
            ingredients_tags (
              name
            )
          )
        `)
        .order('name')
      if (error) throw error
      return data
    },
  })

  // Fetch tags (RLS will automatically filter to user's own tags)
  const { data: tags } = useQuery({
    queryKey: ["ingredient-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients_tags")
        .select("*")
        .order('name')
      if (error) throw error
      return data
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

  // Add tag mutation
  const addTag = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("No user")
      const { error } = await supabase
        .from("ingredients_tags")
        .insert({ name: newTag, created_by: session.user.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredient-tags"] })
      setNewTag("")
      toast({
        title: "Success",
        description: "Tag added successfully",
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Ingredients Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Manage your ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add new ingredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
              />
              <Button onClick={() => addIngredient.mutate()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {ingredients?.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2">
                    <span>{ingredient.name}</span>
                    <div className="flex gap-1">
                      {ingredient.ingredients_to_tags?.map((relation) => (
                        <Badge
                          key={relation.tag_id}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {relation.ingredients_tags.name}
                          <button
                            onClick={() => removeTagFromIngredient.mutate({
                              ingredientId: ingredient.id,
                              tagId: relation.tag_id
                            })}
                            className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
                          >
                            <Trash className="h-3 w-3 text-destructive" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteIngredient.mutate(ingredient.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Create tags to group ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button onClick={() => addTag.mutate()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
