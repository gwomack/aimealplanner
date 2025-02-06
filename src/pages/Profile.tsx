
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm"
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm"

export default function Profile() {
  return (
    <div className="container max-w-2xl py-4 space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and dietary preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm />
        </CardContent>
      </Card>
    </div>
  )
}
