
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
type UserLevel = Database['public']['Enums']['user_level'];

type UserWithRole = Profile & {
  role: AppRole;
};

interface EditUserDialogProps {
  user: UserWithRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, role: AppRole, level?: UserLevel) => void;
  selectedRole: AppRole;
  selectedLevel?: UserLevel;
  onRoleChange: (role: AppRole) => void;
  onLevelChange: (level: UserLevel) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSubmit,
  selectedRole,
  selectedLevel,
  onRoleChange,
  onLevelChange,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's role and level. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as AppRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Level</label>
              <Select 
                value={selectedLevel} 
                onValueChange={(value) => onLevelChange(value as UserLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literary Tamil Writers">Literary Tamil Writers</SelectItem>
                  <SelectItem value="Talented Experts">Talented Experts</SelectItem>
                  <SelectItem value="NATAWO Volunteers">NATAWO Volunteers</SelectItem>
                  <SelectItem value="NATAWO Students Writers">NATAWO Students Writers</SelectItem>
                  <SelectItem value="Subscriber">Subscriber</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => user && onSubmit(user.id, selectedRole, selectedLevel)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
