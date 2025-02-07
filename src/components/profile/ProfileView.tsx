
import { Label } from "@/components/ui/label";
import { Profile } from "@/integrations/supabase/types/models";

interface ProfileViewProps {
  profile: Profile | null;
}

export function ProfileView({ profile }: ProfileViewProps) {
  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-muted-foreground">Full Name</Label>
        <p className="mt-1">{profile.full_name || 'Not set'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">Email</Label>
        <p className="mt-1">{profile.email || 'Not set'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">User Type</Label>
        <p className="mt-1">{profile.user_type || 'Not set'}</p>
      </div>
    </div>
  );
}
