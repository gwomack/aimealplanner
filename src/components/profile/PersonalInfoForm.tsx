
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/contexts/AuthProvider"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useQuery } from "@tanstack/react-query"
import { PersonalDetailsForm } from "./PersonalDetailsForm"
import { ExcludedIngredientsForm } from "./ExcludedIngredientsForm"

interface PersonalInfoFormValues {
  age: string
  weight: string
  height: string
  sex: string
  excludedIngredients: string
}

export function PersonalInfoForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<PersonalInfoFormValues>({
    defaultValues: {
      age: "",
      weight: "",
      height: "",
      sex: "",
      excludedIngredients: "",
    },
  })

  // Fetch personal information
  const { data: personalInfo } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      const { data: personalData, error: personalError } = await supabase
        .from("personal_information")
        .select("age, weight, height, sex")
        .eq("user_id", session?.user.id)
        .maybeSingle()

      if (personalError) {
        toast({
          variant: "destructive",
          title: "Error fetching personal information",
          description: personalError.message,
        })
        return null
      }

      if (personalData) {
        form.setValue("age", personalData.age?.toString() || "")
        form.setValue("weight", personalData.weight?.toString() || "")
        form.setValue("height", personalData.height?.toString() || "")
        form.setValue("sex", personalData.sex || "")
      }

      return personalData
    },
    enabled: !!session,
  })

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!session?.user.id) return

    setLoading(true)

    try {
      // Check if personal information exists
      const { data: existingData, error: checkError } = await supabase
        .from("personal_information")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle()

      if (checkError) throw checkError

      // Update or insert personal information based on existence
      const personalInfoData = {
        user_id: session.user.id,
        age: parseInt(data.age) || null,
        weight: parseFloat(data.weight) || null,
        height: parseFloat(data.height) || null,
        sex: data.sex || null,
      }

      let personalError
      if (existingData) {
        const { error } = await supabase
          .from("personal_information")
          .update(personalInfoData)
          .eq("user_id", session.user.id)
        personalError = error
      } else {
        const { error } = await supabase
          .from("personal_information")
          .insert([personalInfoData])
        personalError = error
      }

      if (personalError) throw personalError

      toast({
        title: "Personal information updated",
        description: "Your personal information has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating personal information",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalDetailsForm form={form} />
        <ExcludedIngredientsForm form={form} />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Personal Information"}
        </Button>
      </form>
    </Form>
  )
}
