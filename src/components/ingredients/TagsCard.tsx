
import { useState } from "react"
import { useAuth } from "@/contexts/AuthProvider"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Tag, Trash, Search } from "lucide-react"
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

export function TagsCard() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newTag, setNewTag] = useState("")
  const [tagSearch, setTagSearch] = useState("")

  // Fetch tags
  const { data: tags } = useQuery({
    queryKey: ["ingredient-tags", tagSearch],
    queryFn: async () => {
      let query = supabase
        .from("ingredients_tags")
        .select("*")
        .order('name')
      
      if (tagSearch) {
        query = query.ilike('name', `%${tagSearch}%`)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
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

  // Delete tag mutation
  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ingredients_tags")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredient-tags", "ingredients"] })
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      })
    },
  })

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>Create and manage tags</CardDescription>
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
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Tag className="h-3 w-3" />
              {tag.name}
              <button
                onClick={() => deleteTag.mutate(tag.id)}
                className="hover:bg-secondary-foreground/10 rounded-full p-0.5"
              >
                <Trash className="h-3 w-3 text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
