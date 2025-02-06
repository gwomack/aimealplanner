
import { ChefHat } from "lucide-react"
import { CreatePlanForm } from "@/components/meal-plan/CreatePlanForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreatePlan() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="border border-white/10 backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6]">
            <ChefHat className="h-8 w-8" />
            Create New Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePlanForm />
        </CardContent>
      </Card>
    </div>
  )
}
