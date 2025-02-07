
import { useIngredientsData } from "@/components/ingredients/useIngredientsData"
import { IngredientsCard } from "@/components/ingredients/IngredientsCard"
import { TagsCard } from "@/components/ingredients/TagsCard"

export default function Ingredients() {
  const {
    ingredientsData,
    newIngredient,
    setNewIngredient,
    ingredientSearch,
    setIngredientSearch,
    currentPage,
    setCurrentPage,
    addIngredient,
    deleteIngredient,
    removeTagFromIngredient,
    ITEMS_PER_PAGE,
  } = useIngredientsData()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Ingredients Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <IngredientsCard
          newIngredient={newIngredient}
          setNewIngredient={setNewIngredient}
          ingredientSearch={ingredientSearch}
          setIngredientSearch={setIngredientSearch}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          ingredients={ingredientsData?.items || []}
          totalPages={Math.ceil((ingredientsData?.total || 0) / ITEMS_PER_PAGE)}
          addIngredient={addIngredient}
          deleteIngredient={deleteIngredient}
          removeTagFromIngredient={removeTagFromIngredient}
          itemsPerPage={ITEMS_PER_PAGE}
          total={ingredientsData?.total || 0}
        />
        <TagsCard />
      </div>
    </div>
  )
}
