
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { IngredientInputProps } from "./types"
import { useSearchSuggestions } from "./hooks/useSearchSuggestions"

export function IngredientInput({
  currentIngredient,
  setCurrentIngredient,
  handleKeyDown,
  label,
  form,
  fieldName,
}: IngredientInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { ingredientSuggestions, tagSuggestions, searchIngredients, searchTags } = useSearchSuggestions()

  useEffect(() => {
    if (currentIngredient) {
      searchIngredients(currentIngredient)
      searchTags(currentIngredient)
    }
  }, [currentIngredient])

  const handleSuggestionSelect = (value: string) => {
    setCurrentIngredient(value)
    setShowSuggestions(false)
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                value={currentIngredient}
                onChange={(e) => {
                  setCurrentIngredient(e.target.value)
                  setShowSuggestions(true)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => currentIngredient && setShowSuggestions(true)}
                placeholder="Type ingredient and press Enter or comma to add"
              />
              {showSuggestions && (currentIngredient.length > 0) && (
                <Command className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-lg bg-popover max-h-[300px] overflow-y-auto">
                  <CommandList>
                    {ingredientSuggestions.length > 0 && (
                      <CommandGroup heading="Ingredients">
                        {ingredientSuggestions.map((ingredient) => (
                          <CommandItem
                            key={ingredient.id}
                            value={ingredient.name}
                            onSelect={handleSuggestionSelect}
                          >
                            {ingredient.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {tagSuggestions.length > 0 && (
                      <CommandGroup heading="Tags">
                        {tagSuggestions.map((tag) => (
                          <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={handleSuggestionSelect}
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            {tag.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {ingredientSuggestions.length === 0 && tagSuggestions.length === 0 && (
                      <CommandEmpty>No results found</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
