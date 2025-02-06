
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const Index = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Generate New Plan
        </Button>
      </div>
      <div className="text-muted-foreground">
        No meal plans yet! Tap the button above to get started.
      </div>
    </div>
  )
}

export default Index
