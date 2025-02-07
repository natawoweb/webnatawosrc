
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Edit2 } from "lucide-react";
import { ProfileView } from "@/components/profile/ProfileView";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { useUserMutations } from "@/hooks/user-management/useUserMutations";
import { type UserWithRole } from "@/types/user-management";
import { type UserLevel } from "@/integrations/supabase/types/models";
import { type Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type AppRole = Database['public']['Enums']['app_role'];

interface AdminUserProfileViewProps {
  profile: UserWithRole | null;
}

export function AdminUserProfileView({ profile }: AdminUserProfileViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>(profile?.role || 'reader');
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | undefined>(profile?.level as UserLevel);
  const { updateUserMutation } = useUserMutations();

  if (!profile) {
    return null;
  }

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        userId: profile.id,
        role: selectedRole,
        level: selectedLevel,
      });

      // Invalidate all related queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile", profile.id] });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "User role and level updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role and level",
      });
    }
  };

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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Role & Level"}
              </Button>
            </div>

            <AvatarUpload
              avatarUrl={profile.avatar_url}
              fullName={profile.full_name}
              isEditing={false}
              uploading={false}
              onAvatarChange={() => {}}
            />

            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Role</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value: AppRole) => setSelectedRole(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reader">Reader</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Level</Label>
                    <Select
                      value={selectedLevel}
                      onValueChange={(value: UserLevel) => setSelectedLevel(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Literary Tamil Writers">Literary Tamil Writers</SelectItem>
                        <SelectItem value="Talented Experts">Talented Experts</SelectItem>
                        <SelectItem value="NATAWO Volunteers">NATAWO Volunteers</SelectItem>
                        <SelectItem value="NATAWO Students Writers">NATAWO Students Writers</SelectItem>
                        <SelectItem value="Subscriber">Subscriber</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
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
              )}

              <ProfileView profile={profile} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
