import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

type UserWithRole = Profile & {
  role: AppRole;
};

interface EditUserDialogProps {
  user: UserWithRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, role: AppRole) => void;
  selectedRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSubmit,
  selectedRole,
  onRoleChange,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => user && onSubmit(user.id, selectedRole)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}