
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Apple, Carrot, Pizza, CakeSlice, ChefHat, UtensilsCrossed, Search, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"

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
      // Delete related daily plans first
      const { error: dailyPlansError } = await supabase
        .from("daily_meal_plans")
        .delete()
        .eq("weekly_plan_id", planId)

      if (dailyPlansError) throw dailyPlansError

      // Delete related ingredients
      const { error: ingredientsError } = await supabase
        .from("weekly_meal_plan_ingredients")
        .delete()
        .eq("weekly_plan_id", planId)

      if (ingredientsError) throw ingredientsError

      // Finally delete the weekly plan
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
      queryClient.invalidateQueries({ queryKey: ["weeklyPlans"] })
    }
  }

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

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) // Reset to first page when searching
          }}
          className="pl-10"
        />
      </div>

      {currentPlans.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
            {currentPlans.map((plan) => (
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
                          onClick={() => deleteMutation.mutate(plan.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={
                        currentPage === page
                          ? "bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white"
                          : ""
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
