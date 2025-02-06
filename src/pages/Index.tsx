
import { Button } from "@/components/ui/button"
import { Calendar, ChefHat, User2, Utensils, Sparkles, Leaf, ArrowRight } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F97316]/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D946EF]/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Hero Content */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-foreground">
              <Sparkles className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm font-medium">Transform Your Eating Habits</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
              <span className="bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6] bg-clip-text text-transparent">
                Eat Healthy Without the Hassle
              </span>
              <br />
              <span className="text-foreground">AI-Powered Meal Plans for Busy Lives</span>
            </h1>
            
            <p className="text-xl text-secondary max-w-2xl mx-auto animate-fade-in">
              Get personalized, easy-to-follow meal plans tailored to your lifestyle, goals, and dietary preferences—all in minutes. Let AI do the planning while you focus on enjoying delicious, healthy meals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90 min-w-[200px] group">
                Get My Free Meal Plan
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10">
                <Utensils className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* How It Works Section */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#FEC6A1] flex items-center justify-center mx-auto">
                  <User2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#F97316]">1. Answer Questions</h3>
                <p className="text-secondary">Tell us about your goals, allergies, and preferences.</p>
              </div>
              
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#D946EF] to-[#FFDEE2] flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#D946EF]">2. Receive Your Plan</h3>
                <p className="text-secondary">Get a customized weekly meal plan delivered instantly.</p>
              </div>
              
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E5DEFF] flex items-center justify-center mx-auto">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#8B5CF6]">3. Enjoy Healthy Meals</h3>
                <p className="text-secondary">Follow the recipes and shop from our smart grocery list.</p>
              </div>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">Why Choose Our App?</h2>
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
              <div className="p-6 rounded-lg border border-[#F97316]/20 bg-gradient-to-b from-[#F97316]/5 to-transparent hover:from-[#F97316]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#FEC6A1] flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#F97316]">AI-Powered Plans</h3>
                <p className="text-secondary">Personalized meal plans generated by advanced AI to match your preferences.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-[#D946EF]/20 bg-gradient-to-b from-[#D946EF]/5 to-transparent hover:from-[#D946EF]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#D946EF] to-[#FFDEE2] flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#D946EF]">Smart Shopping Lists</h3>
                <p className="text-secondary">Automatically generated grocery lists that save you time and reduce food waste.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-[#8B5CF6]/20 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E5DEFF] flex items-center justify-center mb-4">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Quick & Easy Recipes</h3>
                <p className="text-secondary">Simple, delicious recipes designed for busy schedules and all skill levels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
