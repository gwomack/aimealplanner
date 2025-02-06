
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import Navigation from "./Navigation"
import { Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"

export default function RootLayout() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      })
    } else {
      navigate("/auth")
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Meal Planner</span>
              <span className="text-xs text-secondary">AI-Powered</span>
            </div>
          </div>

          {/* Navigation Links */}
          <Navigation />

          {/* Action Buttons */}
          <Button 
            variant="outline" 
            className="text-secondary hover:text-foreground" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
