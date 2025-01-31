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

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserLevel = Database['public']['Enums']['user_level'];
type AppRole = Database['public']['Enums']['app_role'];

interface ProfileDialogProps {
  profile: (Profile & { role: AppRole }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (profile: Partial<Profile>) => void;
  isAdmin: boolean;
}

const USER_LEVELS: UserLevel[] = [
  'Literary Tamil Writers',
  'Talented Experts',
  'NATAWO Volunteers',
  'NATAWO Students Writers'
];

export function ProfileDialog({
  profile,
  open,
  onOpenChange,
  onSubmit,
  isAdmin,
}: ProfileDialogProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [level, setLevel] = useState<UserLevel | undefined>(profile?.level || undefined);

  const handleSubmit = () => {
    if (!profile) return;
    onSubmit({
      id: profile.id,
      full_name: fullName,
      bio,
      level,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
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
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isAdmin}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isAdmin}
                className="h-32"
                placeholder="Enter user bio"
              />
            </div>

            {isAdmin && (
              <div>
                <label className="text-sm font-medium">Level</label>
                <Select
                  value={level}
                  onValueChange={(value) => setLevel(value as UserLevel)}
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
        {isAdmin && (
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