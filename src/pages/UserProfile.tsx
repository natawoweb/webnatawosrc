
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function UserProfile() {
  const {
    loading,
    profile,
    isEditing,
    editedProfile,
    setIsEditing,
    updateProfile,
    handleProfileChange,
    handleCancel,
  } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <ProfileHeader
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
          onBackClick={() => window.history.back()}
        />
        <CardContent>
          <div className="space-y-8">
            {isEditing ? (
              <ProfileForm
                editedProfile={editedProfile}
                onProfileChange={handleProfileChange}
                onSubmit={updateProfile}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileView profile={profile} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
