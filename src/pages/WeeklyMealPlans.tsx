
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Weekly Meal Plans
        </h1>
        <Button onClick={handleCreatePlan} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {weeklyPlans && weeklyPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
          {weeklyPlans.map((plan) => (
            <Card 
              key={plan.id}
              className="relative group hover:shadow-lg transition-all duration-300 border border-border/50 backdrop-blur-sm bg-gradient-to-br from-card/50 to-card/30"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Created on {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 border border-border/50 backdrop-blur-sm bg-gradient-to-br from-card/50 to-card/30">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">No meal plans yet</p>
            <Button 
              onClick={handleCreatePlan} 
              variant="outline"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
            >
              Create your first meal plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
