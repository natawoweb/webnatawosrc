
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/models";

interface ProfileFormProps {
  editedProfile: Profile;
  onProfileChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ProfileForm({ 
  editedProfile, 
  onProfileChange, 
  onSubmit, 
  onCancel 
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          value={editedProfile?.full_name || ''}
          onChange={(e) => onProfileChange('full_name', e.target.value)}
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={editedProfile?.email || ''}
          onChange={(e) => onProfileChange('email', e.target.value)}
          placeholder="Enter your email"
          className="w-full"
          disabled
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          Update Profile
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
