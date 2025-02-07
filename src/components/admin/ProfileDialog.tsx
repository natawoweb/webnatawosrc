
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { type Profile } from "@/integrations/supabase/types/models";
import { type AppRole } from "@/integrations/supabase/types/models";

interface ProfileDialogProps {
  profile: (Profile & { role: AppRole }) | null;
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

  const handleSubmit = () => {
    if (!profile) return;
    onSubmit({
      id: profile.id,
      full_name: fullName,
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
              <AvatarFallback>{profile?.full_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{profile?.email}</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {profile?.role}
                </Badge>
                <Badge variant="secondary">
                  {profile?.user_type}
                </Badge>
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
