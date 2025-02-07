
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthProvider"
import RootLayout from "./components/layout/RootLayout"
import WeeklyMealPlans from "./pages/WeeklyMealPlans"
import CreatePlan from "./pages/CreatePlan"
import MealPlanDetail from "./pages/MealPlanDetail"
import Ingredients from "./pages/Ingredients"
import Profile from "./pages/Profile"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"
import Index from "./pages/Index"
import { useMemo } from "react"

const App = () => {
  // Create a stable queryClient instance
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<RootLayout />}>
                <Route path="/plans" element={<WeeklyMealPlans />} />
                <Route path="/plans/:id" element={<MealPlanDetail />} />
                <Route path="/generate" element={<CreatePlan />} />
                <Route path="/ingredients" element={<Ingredients />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
