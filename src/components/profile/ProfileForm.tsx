
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileFormProps {
  editedProfile: any;
  onProfileChange: (field: string, value: any) => void;
  onSocialLinkChange: (platform: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ProfileForm({ 
  editedProfile, 
  onProfileChange, 
  onSocialLinkChange, 
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
        <Label htmlFor="county">Country</Label>
        <Select 
          value={editedProfile?.county || ''} 
          onValueChange={(value) => onProfileChange('county', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pseudonym">Pseudonym</Label>
        <Input
          id="pseudonym"
          type="text"
          value={editedProfile?.pseudonym || ''}
          onChange={(e) => onProfileChange('pseudonym', e.target.value)}
          placeholder="Enter your pseudonym"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={editedProfile?.date_of_birth || ''}
          onChange={(e) => onProfileChange('date_of_birth', e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={editedProfile?.gender || ''}
          onValueChange={(value) => onProfileChange('gender', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={editedProfile?.bio || ''}
          onChange={(e) => onProfileChange('bio', e.target.value)}
          placeholder="Tell us about yourself"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <Label>Social Media Links</Label>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              type="url"
              value={editedProfile?.social_links?.twitter || ''}
              onChange={(e) => onSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              type="url"
              value={editedProfile?.social_links?.facebook || ''}
              onChange={(e) => onSocialLinkChange('facebook', e.target.value)}
              placeholder="https://facebook.com/username"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              value={editedProfile?.social_links?.instagram || ''}
              onChange={(e) => onSocialLinkChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={editedProfile?.social_links?.linkedin || ''}
              onChange={(e) => onSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
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
