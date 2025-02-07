
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchIngredientsProps {
  ingredientSearch: string
  setIngredientSearch: (value: string) => void
}

export function SearchIngredients({
  ingredientSearch,
  setIngredientSearch
}: SearchIngredientsProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search ingredients"
        value={ingredientSearch}
        onChange={(e) => setIngredientSearch(e.target.value)}
      />
    </div>
  )
}
