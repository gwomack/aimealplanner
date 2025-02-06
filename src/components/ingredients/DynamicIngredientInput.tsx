
import { DynamicIngredientInputProps } from "./types"
import { IngredientInput } from "./IngredientInput"
import { IngredientBadge } from "./IngredientBadge"
import { useIngredients } from "./useIngredients"

export function DynamicIngredientInput({
  form,
  fieldName,
  label,
  tableName,
  ingredientColumn = "ingredient",
  realtime = true
}: DynamicIngredientInputProps) {
  const {
    currentIngredient,
    setCurrentIngredient,
    ingredientsList,
    handleKeyDown,
    removeIngredient,
  } = useIngredients(form, fieldName, tableName, ingredientColumn, realtime)

  return (
    <div className="space-y-2">
      <IngredientInput
        currentIngredient={currentIngredient}
        setCurrentIngredient={setCurrentIngredient}
        handleKeyDown={handleKeyDown}
        label={label}
        form={form}
        fieldName={fieldName}
      />
      {ingredientsList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredientsList.map((ingredient, index) => (
            <IngredientBadge
              key={index}
              ingredient={ingredient}
              onRemove={removeIngredient}
            />
          ))}
        </div>
      )}
    </div>
  )
}
