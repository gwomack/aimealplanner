
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MealPlanCardProps {
  plan: {
    id: string
    name: string
    created_at: string
  }
  onDelete: (id: string) => void
}

export const MealPlanCard = ({ plan, onDelete }: MealPlanCardProps) => {
  return (
    <Card className="relative group hover:shadow-lg transition-all duration-300 border border-white/10 backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/20">
      <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-to-r from-[#F97316] to-[#D946EF] flex items-center justify-center">
        <UtensilsCrossed className="h-4 w-4 text-white" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6] bg-clip-text text-transparent">
          {plan.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Created on {new Date(plan.created_at).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/plans/${plan.id}`} className="flex-1">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full group-hover:bg-gradient-to-r group-hover:from-[#F97316] group-hover:to-[#D946EF] group-hover:text-white transition-all duration-300"
          >
            View Details
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-red-500 group-hover:text-white transition-all duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this meal plan? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(plan.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
