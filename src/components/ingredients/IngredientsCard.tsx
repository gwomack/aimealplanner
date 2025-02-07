
import { Plus, Search, Tag, Trash } from "lucide-react"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { type Ingredient } from "./types"
import { UseMutationResult } from "@tanstack/react-query"

interface IngredientsCardProps {
  newIngredient: string
  setNewIngredient: (value: string) => void
  ingredientSearch: string
  setIngredientSearch: (value: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  ingredients: Ingredient[]
  totalPages: number
  addIngredient: UseMutationResult<void, Error, void, unknown>
  deleteIngredient: UseMutationResult<void, Error, string, unknown>
  removeTagFromIngredient: UseMutationResult<void, Error, { ingredientId: string; tagId: string }, unknown>
  itemsPerPage: number
  total: number
}

export function IngredientsCard({
  newIngredient,
  setNewIngredient,
  ingredientSearch,
  setIngredientSearch,
  currentPage,
  setCurrentPage,
  ingredients,
  totalPages,
  addIngredient,
  deleteIngredient,
  removeTagFromIngredient,
  itemsPerPage,
  total
}: IngredientsCardProps) {
  return (
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
        
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients"
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2 mb-4">
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

        {total > itemsPerPage && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}
