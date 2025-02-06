
import { NavLink } from "react-router-dom"
import { CalendarDays, Plus, Settings, UserCircle2 } from "lucide-react"

const navigation = [
  {
    title: "Meal Plans",
    path: "/plans",
    icon: CalendarDays,
  },
  {
    title: "Create Plan",
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
    <nav className="flex items-center gap-1">
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  )
}
