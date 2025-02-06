
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthProvider"

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
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weekly Meal Plans</h1>
        <Button onClick={handleCreatePlan}>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {weeklyPlans && weeklyPlans.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeklyPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>
                  {new Date(plan.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No meal plans yet</p>
          <Button onClick={handleCreatePlan} variant="outline" className="mt-4">
            Create your first meal plan
          </Button>
        </div>
      )}
    </div>
  )
}
