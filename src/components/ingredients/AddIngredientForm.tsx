
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UseMutationResult } from "@tanstack/react-query"

interface AddIngredientFormProps {
  newIngredient: string
  setNewIngredient: (value: string) => void
  addIngredient: UseMutationResult<void, Error, void, unknown>
}

export function AddIngredientForm({
  newIngredient,
  setNewIngredient,
  addIngredient
}: AddIngredientFormProps) {
  return (
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
  )
}
