
import { IngredientBadge } from "./IngredientBadge"

interface IngredientsListProps {
  ingredients: string[]
  onRemoveIngredient: (ingredient: string) => void
}

export function IngredientsList({ ingredients, onRemoveIngredient }: IngredientsListProps) {
  if (ingredients.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {ingredients.map((ingredient, index) => (
        <IngredientBadge
          key={index}
          ingredient={ingredient}
          onRemove={onRemoveIngredient}
        />
      ))}
    </div>
  )
}
