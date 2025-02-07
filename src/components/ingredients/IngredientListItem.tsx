
import { Tag, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Ingredient } from "./types"
import { UseMutationResult } from "@tanstack/react-query"

interface IngredientListItemProps {
  ingredient: Ingredient
  deleteIngredient: UseMutationResult<void, Error, string, unknown>
  removeTagFromIngredient: UseMutationResult<void, Error, { ingredientId: string; tagId: string }, unknown>
}

export function IngredientListItem({
  ingredient,
  deleteIngredient,
  removeTagFromIngredient
}: IngredientListItemProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
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
  )
}
