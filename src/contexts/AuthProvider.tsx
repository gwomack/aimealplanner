
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"

interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session && location.pathname === "/auth") {
        navigate("/plans")
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session && location.pathname !== "/" && location.pathname !== "/auth") {
        navigate("/auth")
      } else if (session && location.pathname === "/auth") {
        navigate("/plans")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
