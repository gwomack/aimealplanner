
import { UtensilsCrossed, Flame, Dumbbell, Beef, Cookie } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MealCardProps {
  meal: {
    type: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    description: string
  }
}

export const MealCard = ({ meal }: MealCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge 
            className={cn(
              "text-white px-3 py-1",
              meal.type === "breakfast" && "bg-[#F97316]",
              meal.type === "lunch" && "bg-[#D946EF]",
              meal.type === "dinner" && "bg-[#8B5CF6]",
              meal.type === "snack" && "bg-[#9b87f5]"
            )}
          >
            <UtensilsCrossed className="w-3 h-3 mr-1" />
            {meal.type}
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6]">
          {meal.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge variant="outline" className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white border-none">
            <Flame className="w-3 h-3 mr-1" />
            {meal.calories} calories
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white border-none">
            <Dumbbell className="w-3 h-3 mr-1" />
            {meal.protein}g protein
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-[#8B5CF6] to-[#F97316] text-white border-none">
            <Cookie className="w-3 h-3 mr-1" />
            {meal.carbs}g carbs
          </Badge>
          <Badge variant="outline" className="bg-gradient-to-r from-[#F97316] to-[#8B5CF6] text-white border-none">
            <Beef className="w-3 h-3 mr-1" />
            {meal.fat}g fat
          </Badge>
        </div>
        <p className="mt-4 text-muted-foreground">{meal.description}</p>
      </CardContent>
    </Card>
  )
}

