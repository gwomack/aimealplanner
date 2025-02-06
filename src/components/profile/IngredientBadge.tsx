
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface IngredientBadgeProps {
  ingredient: string
  onRemove: (ingredient: string) => void
}

export function IngredientBadge({ ingredient, onRemove }: IngredientBadgeProps) {
  return (
    <Badge variant="secondary" className="text-sm flex items-center gap-1">
      {ingredient}
      <button
        type="button"
        onClick={() => onRemove(ingredient)}
        className="hover:bg-secondary-foreground/10 rounded-full p-1"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
