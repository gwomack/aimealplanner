
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { AddIngredientForm } from "./AddIngredientForm"
import { SearchIngredients } from "./SearchIngredients"
import { IngredientListItem } from "./IngredientListItem"

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
        <AddIngredientForm
          newIngredient={newIngredient}
          setNewIngredient={setNewIngredient}
          addIngredient={addIngredient}
        />
        
        <SearchIngredients
          ingredientSearch={ingredientSearch}
          setIngredientSearch={setIngredientSearch}
        />

        <div className="space-y-2 mb-4">
          {ingredients?.map((ingredient) => (
            <IngredientListItem
              key={ingredient.id}
              ingredient={ingredient}
              deleteIngredient={deleteIngredient}
              removeTagFromIngredient={removeTagFromIngredient}
            />
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
