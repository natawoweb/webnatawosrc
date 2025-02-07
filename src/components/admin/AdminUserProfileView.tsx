
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileView } from "@/components/profile/ProfileView";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { type UserWithRole } from "@/types/user-management";

interface AdminUserProfileViewProps {
  profile: UserWithRole | null;
}

export function AdminUserProfileView({ profile }: AdminUserProfileViewProps) {
  const navigate = useNavigate();

  if (!profile) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to User Management
      </Button>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-8">
            <AvatarUpload
              avatarUrl={profile.avatar_url}
              fullName={profile.full_name}
              isEditing={false}
              uploading={false}
              onAvatarChange={() => {}}
            />

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="capitalize">
                  Role: {profile.role}
                </Badge>
                {profile.level && (
                  <Badge>
                    Level: {profile.level}
                  </Badge>
                )}
              </div>

              <ProfileView profile={profile} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
