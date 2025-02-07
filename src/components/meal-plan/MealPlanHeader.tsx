
import { Button } from "@/components/ui/button"
import { Plus, Apple, Carrot, Pizza, CakeSlice, ChefHat } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const MealPlanHeader = ({ userId }: { userId: string }) => {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <div className="absolute -top-4 left-0 flex gap-6 animate-bounce opacity-50">
        <Apple className="h-6 w-6 text-[#F97316]" />
        <Carrot className="h-6 w-6 text-[#D946EF] animate-bounce delay-100" />
        <Pizza className="h-6 w-6 text-[#8B5CF6] animate-bounce delay-200" />
        <CakeSlice className="h-6 w-6 text-[#F97316] animate-bounce delay-300" />
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6] flex items-center gap-3">
          <ChefHat className="h-8 w-8" />
          Weekly Meal Plans
        </h1>
        <Button 
          onClick={() => navigate('/generate')} 
          className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>
    </div>
  )
}
