
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Apple, Carrot, Pizza, CakeSlice, ChefHat, UtensilsCrossed } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function WeeklyMealPlans() {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: weeklyPlans, isLoading } = useQuery({
    queryKey: ["weeklyPlans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_meal_plans")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching meal plans",
          description: error.message,
        })
        return []
      }

      return data
    },
    enabled: !!session,
  })

  const handleCreatePlan = async () => {
    const { error } = await supabase.from("weekly_meal_plans").insert({
      name: `Meal Plan ${new Date().toLocaleDateString()}`,
      user_id: session?.user.id,
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating meal plan",
        description: error.message,
      })
    } else {
      toast({
        title: "Success",
        description: "New meal plan created",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header with floating food icons */}
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
          <Button onClick={handleCreatePlan} className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      {weeklyPlans && weeklyPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
          {weeklyPlans.map((plan) => (
            <Card 
              key={plan.id}
              className="relative group hover:shadow-lg transition-all duration-300 border border-white/10 backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/20"
            >
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
              <CardFooter>
                <Link to={`/plans/${plan.id}`} className="w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-[#F97316] group-hover:to-[#D946EF] group-hover:text-white transition-all duration-300"
                  >
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 border border-white/10 backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/20">
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-4 mb-6">
              <Pizza className="h-12 w-12 text-[#F97316] animate-bounce" />
              <ChefHat className="h-12 w-12 text-[#D946EF] animate-bounce delay-100" />
              <UtensilsCrossed className="h-12 w-12 text-[#8B5CF6] animate-bounce delay-200" />
            </div>
            <p className="text-muted-foreground">No meal plans yet</p>
            <Button 
              onClick={handleCreatePlan} 
              variant="outline"
              className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90"
            >
              Create your first meal plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
