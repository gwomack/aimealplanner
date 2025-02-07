
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { Pizza, ChefHat, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MealPlanHeader } from "@/components/meal-plan/MealPlanHeader"
import { SearchBar } from "@/components/meal-plan/SearchBar"
import { MealPlanCard } from "@/components/meal-plan/MealPlanCard"
import { PlanPagination } from "@/components/meal-plan/PlanPagination"

const ITEMS_PER_PAGE = 6

export default function WeeklyMealPlans() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const queryClient = useQueryClient()

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

  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error: dailyPlansError } = await supabase
        .from("daily_meal_plans")
        .delete()
        .eq("weekly_plan_id", planId)

      if (dailyPlansError) throw dailyPlansError

      const { error: ingredientsError } = await supabase
        .from("weekly_meal_plan_ingredients")
        .delete()
        .eq("weekly_plan_id", planId)

      if (ingredientsError) throw ingredientsError

      const { error } = await supabase
        .from("weekly_meal_plans")
        .delete()
        .eq("id", planId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeklyPlans"] })
      toast({
        title: "Success",
        description: "Meal plan deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting meal plan",
        description: error.message,
      })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F97316]" />
      </div>
    )
  }

  // Filter plans based on search query
  const filteredPlans = weeklyPlans?.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Pagination calculations
  const totalPlans = filteredPlans.length
  const totalPages = Math.ceil(totalPlans / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPlans = filteredPlans.slice(startIndex, endIndex)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <MealPlanHeader userId={session?.user.id || ''} />
      
      <SearchBar value={searchQuery} onChange={handleSearch} />

      {currentPlans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
            {currentPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                plan={plan}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>

          <PlanPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <Card className="text-center py-12 border border-white/10 backdrop-blur-sm bg-gradient-to-br from-black/40 to-black/20">
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-4 mb-6">
              <Pizza className="h-12 w-12 text-[#F97316] animate-bounce" />
              <ChefHat className="h-12 w-12 text-[#D946EF] animate-bounce delay-100" />
              <UtensilsCrossed className="h-12 w-12 text-[#8B5CF6] animate-bounce delay-200" />
            </div>
            <p className="text-muted-foreground">
              {searchQuery ? "No meal plans found matching your search" : "No meal plans yet"}
            </p>
            <Button 
              onClick={() => {
                if (session?.user.id) {
                  const userId = session.user.id
                  const { error } = supabase.from("weekly_meal_plans").insert({
                    name: `Meal Plan ${new Date().toLocaleDateString()}`,
                    user_id: userId,
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
                    queryClient.invalidateQueries({ queryKey: ["weeklyPlans"] })
                  }
                }
              }}
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
