import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Pencil } from "lucide-react";
import { type UserLevel } from "@/integrations/supabase/types/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

const USER_LEVELS: UserLevel[] = [
  'Literary Experts',
  'Aspiring Writers',
  'NATAWO Volunteers',
  'NATAWO Students Writers',
  'Subscriber',
  'Technical'
];

const APP_ROLES: AppRole[] = ['admin', 'writer', 'reader'];

interface ProfileDialogProps {
  profile: (Profile & { role: AppRole }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, role: AppRole, level?: UserLevel) => void;
  isAdmin: boolean;
}

export function ProfileDialog({
  profile,
  open,
  onOpenChange,
  onSubmit,
  isAdmin
}: ProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | undefined>(profile?.role);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | undefined>(
    profile?.level === 'Literary Tamil Writers' ? 'Literary Experts' :
    profile?.level === 'Talented Experts' ? 'Aspiring Writers' :
    profile?.level as UserLevel
  );

  const ProfileField = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="space-y-1.5">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <p className="text-sm">{value || 'Not set'}</p>
    </div>
  );

  const handleSave = () => {
    if (profile?.id && selectedRole) {
      onSubmit(profile.id, selectedRole, selectedLevel);
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>Profile</DialogTitle>
            </div>
            {isAdmin && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{profile?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            {!isEditing && profile?.role && (
              <Badge variant="outline" className="capitalize">
                {profile.role}
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {isEditing ? (
              <>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as AppRole)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
                  <Select
                    value={selectedLevel}
                    onValueChange={(value) => setSelectedLevel(value as UserLevel)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="Full Name" value={profile?.full_name} />
                <ProfileField label="Country" value={profile?.county} />
                <ProfileField label="Pseudonym" value={profile?.pseudonym} />
                <ProfileField label="Date of Birth" value={profile?.date_of_birth} />
                <ProfileField label="Gender" value={profile?.gender} />
                <ProfileField 
                  label="Level" 
                  value={
                    profile?.level === 'Literary Tamil Writers' ? 'Literary Experts' :
                    profile?.level === 'Talented Experts' ? 'Aspiring Writers' :
                    profile?.level
                  } 
                />
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{profile?.bio || 'No bio available'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <DialogFooter className="flex gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
