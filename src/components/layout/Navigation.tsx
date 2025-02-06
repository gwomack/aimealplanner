
import { NavLink } from "react-router-dom"
import { LineChart, Plus, Settings, UserCircle2 } from "lucide-react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LineChart,
  },
  {
    title: "Generate Plan",
    path: "/generate",
    icon: Plus,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: UserCircle2,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
]

export default function Navigation() {
  return (
    <SidebarMenu>
      {navigation.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton asChild>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-primary" : "text-muted-foreground"
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
