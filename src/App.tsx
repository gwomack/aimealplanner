
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthProvider"
import RootLayout from "./components/layout/RootLayout"
import WeeklyMealPlans from "./pages/WeeklyMealPlans"
import Auth from "./pages/Auth"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<RootLayout />}>
              <Route index element={<WeeklyMealPlans />} />
              <Route path="/generate" element={<WeeklyMealPlans />} />
              <Route path="/profile" element={<WeeklyMealPlans />} />
              <Route path="/settings" element={<WeeklyMealPlans />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
