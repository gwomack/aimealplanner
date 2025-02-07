
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
  addIngredient,
  deleteIngredient,
  removeTagFromIngredient,
  itemsPerPage,
  total
}: IngredientsCardProps) {