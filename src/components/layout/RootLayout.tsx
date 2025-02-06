
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import Navigation from "./Navigation"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border bg-background">
          <SidebarHeader className="border-b border-border p-4">
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
          </SidebarHeader>
          <SidebarContent>
            <Navigation />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="outline" className="w-full justify-start text-secondary hover:text-foreground" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="bg-background">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
