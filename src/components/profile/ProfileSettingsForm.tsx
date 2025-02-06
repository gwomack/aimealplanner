
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useQuery } from "@tanstack/react-query"

interface ProfileFormValues {
  email: string
  username: string
  currentPassword: string
  newPassword: string
}

export function ProfileSettingsForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: session?.user?.email || "",
      username: "",
      currentPassword: "",
      newPassword: "",
    },
  })

  // Fetch current profile data
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session?.user.id)
        .maybeSingle()

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        })
        return null
      }

      if (data) {
        form.setValue("username", data.username || "")
      }

      return data
    },
    enabled: !!session,
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true)

    try {
      // Update email if changed
      if (data.email !== session?.user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        })

        if (emailError) throw emailError
      }

      // Update username if changed
      if (data.username !== profile?.username) {
        const { error: usernameError } = await supabase
          .from("profiles")
          .update({ username: data.username })
          .eq("id", session?.user.id)

        if (usernameError) throw usernameError
      }

      // Update password if provided
      if (data.currentPassword && data.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.newPassword,
        })

        if (passwordError) throw passwordError
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Reset password fields
      form.setValue("currentPassword", "")
      form.setValue("newPassword", "")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Change Password</div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
