
import { Button } from "@/components/ui/button"
import { 
  Calendar, ChefHat, User2, Utensils, Sparkles, Leaf, ArrowRight, 
  Clock, DollarSign, Brain, Apple, Carrot, Sandwich, Pizza, 
  CakeSlice, Coffee, Star, CheckCircle2, MessageCircle
} from "lucide-react"

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
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-foreground animate-fade-in">
              <Star className="w-4 h-4 text-[#F97316]" />
              <span className="text-sm font-medium">Rated 4.9/5 by Happy Users</span>
            </div>
            
            {/* Hero Content */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
              <span className="bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#8B5CF6] bg-clip-text text-transparent">
                Healthy Eating Made Effortless
              </span>
              <br />
              <span className="text-foreground">Let AI Do the Work</span>
            </h1>
            
            <p className="text-xl text-secondary max-w-2xl mx-auto animate-fade-in">
              Get personalized, dietitian-approved meal plans in seconds—no nutrition expertise required. Perfect for busy professionals who want to eat healthy without the hassle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90 min-w-[200px] group">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10">
                <Pizza className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Food Icon Grid */}
            <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto mt-8 animate-fade-in">
              <Apple className="w-8 h-8 text-[#F97316] animate-bounce" />
              <Carrot className="w-8 h-8 text-[#D946EF] animate-bounce delay-100" />
              <Sandwich className="w-8 h-8 text-[#8B5CF6] animate-bounce delay-200" />
              <CakeSlice className="w-8 h-8 text-[#F97316] animate-bounce delay-300" />
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">
              Struggling to Eat Healthy with a Busy Schedule?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg border border-[#F97316]/20 bg-gradient-to-b from-[#F97316]/5 to-transparent hover:scale-105 transition-all duration-300">
                <Clock className="w-10 h-10 text-[#F97316] mx-auto mb-4" />
                <p className="text-secondary">No time to research nutrition or plan meals?</p>
              </div>
              <div className="p-6 rounded-lg border border-[#D946EF]/20 bg-gradient-to-b from-[#D946EF]/5 to-transparent hover:scale-105 transition-all duration-300">
                <Brain className="w-10 h-10 text-[#D946EF] mx-auto mb-4" />
                <p className="text-secondary">Overwhelmed by conflicting diet advice?</p>
              </div>
              <div className="p-6 rounded-lg border border-[#8B5CF6]/20 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent hover:scale-105 transition-all duration-300">
                <DollarSign className="w-10 h-10 text-[#8B5CF6] mx-auto mb-4" />
                <p className="text-secondary">Takeout meals draining your wallet and energy?</p>
              </div>
            </div>
            <p className="text-xl mt-8 text-[#F97316] font-semibold">We've got your back.</p>
          </div>
          
          {/* How It Works */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">
              Get Your Perfect Meal Plan in 3 Easy Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F97316] to-[#FEC6A1] flex items-center justify-center mx-auto">
                  <User2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#F97316]">1. Tell Us About You</h3>
                <p className="text-secondary">Share your dietary needs, goals, and preferences.</p>
              </div>
              
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#D946EF] to-[#FFDEE2] flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#D946EF]">2. AI Generates Your Plan</h3>
                <p className="text-secondary">Receive breakfast, lunch, dinner, and snacks for the week.</p>
              </div>
              
              <div className="space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E5DEFF] flex items-center justify-center mx-auto">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#8B5CF6]">3. Cook & Enjoy</h3>
                <p className="text-secondary">Follow simple recipes or sync the grocery list to your favorite store.</p>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">
              Why You'll Love It
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <div className="p-6 rounded-lg border border-[#F97316]/20 bg-gradient-to-b from-[#F97316]/5 to-transparent hover:from-[#F97316]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#FEC6A1] flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#F97316]">Personalized Plans</h3>
                <p className="text-secondary">Adapts to keto, vegan, gluten-free, or any lifestyle.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-[#D946EF]/20 bg-gradient-to-b from-[#D946EF]/5 to-transparent hover:from-[#D946EF]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#D946EF] to-[#FFDEE2] flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#D946EF]">Time-Saver Tools</h3>
                <p className="text-secondary">Batch-cooking guides + 20-minute recipes for hectic days.</p>
              </div>
              
              <div className="p-6 rounded-lg border border-[#8B5CF6]/20 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E5DEFF] flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Progress Tracking</h3>
                <p className="text-secondary">Monitor health goals like energy levels or weight management.</p>
              </div>

              <div className="p-6 rounded-lg border border-[#F97316]/20 bg-gradient-to-b from-[#F97316]/5 to-transparent hover:from-[#F97316]/10 transition-colors group hover:scale-105 duration-300">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#FEC6A1] flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#F97316]">Budget-Friendly</h3>
                <p className="text-secondary">Reduce food waste and save money with smart shopping lists.</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">
              Join Thousands Thriving with Better Meals
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-lg border border-[#F97316]/20 bg-gradient-to-b from-[#F97316]/5 to-transparent hover:scale-105 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-[#F97316] mx-auto mb-4" />
                <p className="text-lg text-secondary mb-4">"I lost 12 pounds without counting calories—it just fits my life!"</p>
                <p className="font-semibold text-[#F97316]">Sarah, Teacher</p>
              </div>
              <div className="p-8 rounded-lg border border-[#D946EF]/20 bg-gradient-to-b from-[#D946EF]/5 to-transparent hover:scale-105 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-[#D946EF] mx-auto mb-4" />
                <p className="text-lg text-secondary mb-4">"Finally, a plan my picky kids AND I love!"</p>
                <p className="font-semibold text-[#D946EF]">Mark, Busy Dad</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-32 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#F97316] to-[#D946EF] bg-clip-text text-transparent">
              Ready to Eat Healthy Without the Hassle?
            </h2>
            <Button size="lg" className="bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white hover:opacity-90 min-w-[200px] group">
              Claim Your Free Trial Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-secondary">No credit card needed. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
