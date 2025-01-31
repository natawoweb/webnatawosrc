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

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserLevel = Database['public']['Enums']['user_level'];

interface ProfileDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (profile: Partial<Profile>) => void;
  isAdmin: boolean;
}

export function ProfileDialog({
  profile,
  open,
  onOpenChange,
  onSubmit,
  isAdmin,
}: ProfileDialogProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const handleSubmit = () => {
    if (!profile) return;
    onSubmit({
      id: profile.id,
      full_name: fullName,
      bio,
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
            <div>
              <h3 className="text-lg font-semibold">{profile?.email}</h3>
              {profile?.level && (
                <Badge variant="secondary" className="mt-1">
                  {profile.level}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!isAdmin}
                className="h-32"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
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