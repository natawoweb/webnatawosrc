
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { type UserLevel } from "@/integrations/supabase/types/models";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

const USER_LEVELS: UserLevel[] = [
  'Literary Tamil Writers',
  'Talented Experts',
  'NATAWO Volunteers',
  'NATAWO Students Writers',
  'Subscriber',
  'Technical'
];

interface ProfileDialogProps {
  profile: (Profile & { role: AppRole }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (profile: Partial<Profile> & { featured?: boolean }) => void;
  isAdmin: boolean;
  isViewMode?: boolean;
}

export function ProfileDialog({
  profile,
  open,
  onOpenChange,
  isViewMode = true
}: ProfileDialogProps) {
  const ProfileField = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="space-y-1.5">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <p className="text-sm">{value || 'Not set'}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DialogTitle>My Profile</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{profile?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            {profile?.role && (
              <Badge variant="outline" className="capitalize">
                {profile.role}
              </Badge>
            )}
          </div>

          <div className="grid gap-6">
            <ProfileField label="Email" value={profile?.email} />
            <ProfileField label="Full Name" value={profile?.full_name} />
            <ProfileField label="Country" value={profile?.county} />
            <ProfileField label="Pseudonym" value={profile?.pseudonym} />
            <ProfileField label="Date of Birth" value={profile?.date_of_birth} />
            <ProfileField label="Gender" value={profile?.gender} />
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
              <p className="text-sm whitespace-pre-wrap">{profile?.bio || 'No bio available'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
