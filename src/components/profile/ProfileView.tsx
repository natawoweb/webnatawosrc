
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
        <Label className="text-muted-foreground">Pseudonym</Label>
        <p className="mt-1">{profile.pseudonym || 'Not set'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">Date of Birth</Label>
        <p className="mt-1">{profile.date_of_birth || 'Not set'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">Gender</Label>
        <p className="mt-1">{profile.gender || 'Not set'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">Bio</Label>
        <p className="mt-1">{profile.bio || 'No bio available'}</p>
      </div>

      <div>
        <Label className="text-muted-foreground">Social Media</Label>
        <div className="mt-2 space-y-2">
          {profile.social_links?.twitter && (
            <p>Twitter: {profile.social_links.twitter}</p>
          )}
          {profile.social_links?.facebook && (
            <p>Facebook: {profile.social_links.facebook}</p>
          )}
          {profile.social_links?.instagram && (
            <p>Instagram: {profile.social_links.instagram}</p>
          )}
          {profile.social_links?.linkedin && (
            <p>LinkedIn: {profile.social_links.linkedin}</p>
          )}
          {(!profile.social_links || Object.keys(profile.social_links).length === 0) && (
            <p className="text-muted-foreground">No social media links added</p>
          )}
        </div>
      </div>
    </div>
  );
}
