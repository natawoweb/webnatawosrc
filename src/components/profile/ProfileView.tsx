
import { Label } from "@/components/ui/label";
import { Profile } from "@/integrations/supabase/types/models";

interface ProfileViewProps {
  profile: Profile | null;
}

export function ProfileView({ profile }: ProfileViewProps) {
  if (!profile) {
    return null;
  }

  const socialLinks = profile.social_links ? 
    (typeof profile.social_links === 'string' ? 
      JSON.parse(profile.social_links) : 
      profile.social_links) : 
    null;

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
          {socialLinks?.twitter && (
            <p>Twitter: {socialLinks.twitter}</p>
          )}
          {socialLinks?.facebook && (
            <p>Facebook: {socialLinks.facebook}</p>
          )}
          {socialLinks?.instagram && (
            <p>Instagram: {socialLinks.instagram}</p>
          )}
          {socialLinks?.linkedin && (
            <p>LinkedIn: {socialLinks.linkedin}</p>
          )}
          {(!socialLinks || Object.keys(socialLinks).length === 0) && (
            <p className="text-muted-foreground">No social media links added</p>
          )}
        </div>
      </div>
    </div>
  );
}
