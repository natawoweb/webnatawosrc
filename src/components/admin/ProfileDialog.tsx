
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { type Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type UserLevel } from "@/integrations/supabase/types/models";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";

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
  onSubmit,
  isAdmin,
  isViewMode = false
}: ProfileDialogProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [level, setLevel] = useState<UserLevel | undefined>(
    profile?.level as UserLevel | undefined
  );
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async () => {
    if (!profile) return;

    const featuredStatus = profile.user_type === 'writer' ? {
      featured: isFeatured,
      featured_month: isFeatured ? new Date().toISOString().substring(0, 7) : null
    } : {};

    onSubmit({
      id: profile.id,
      full_name: fullName,
      bio,
      level,
      ...featuredStatus
    });
  };

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
            <DialogTitle>User Profile</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>{profile?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{profile?.email}</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {profile?.role}
                </Badge>
                {profile?.level && (
                  <Badge variant="secondary">
                    {profile.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              {isViewMode ? (
                <p className="mt-1 text-sm">{fullName || 'N/A'}</p>
              ) : (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isAdmin || isViewMode}
                  placeholder="Enter full name"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              {isViewMode ? (
                <p className="mt-1 text-sm whitespace-pre-wrap">{bio || 'N/A'}</p>
              ) : (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isAdmin || isViewMode}
                  className="h-32"
                  placeholder="Enter user bio"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Level</label>
              {isViewMode ? (
                <p className="mt-1 text-sm">{level || 'Not set'}</p>
              ) : (
                isAdmin && !isViewMode && (
                  <Select
                    value={level}
                    onValueChange={(value: UserLevel) => setLevel(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user level" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_LEVELS.map((userLevel) => (
                        <SelectItem key={userLevel} value={userLevel}>
                          {userLevel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              )}
            </div>

            {isAdmin && !isViewMode && profile?.user_type === 'writer' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="featured">Featured Writer</Label>
                {isFeatured && (
                  <Badge variant="secondary" className="ml-2">
                    Featured for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Badge>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            {profile?.updated_at && (
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
        {isAdmin && !isViewMode && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
