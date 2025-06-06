
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Database } from "@/integrations/supabase/types";
import { type UserLevel } from "@/integrations/supabase/types/models";

type AppRole = Database['public']['Enums']['app_role'];

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, fullName: string, role: AppRole, password: string, level: UserLevel) => Promise<void>;
  isSubmitting: boolean;
}

export function AddUserDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting 
}: AddUserDialogProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>("reader");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState<UserLevel>("Subscriber");

  const handleSubmit = async () => {
    if (!email || !fullName || !role || !password || !level) {
      console.error("All fields are required");
      return;
    }

    try {
      await onSubmit(email, fullName, role, password, level);
      // Only clear the form and close the dialog if the submission was successful
      setEmail("");
      setFullName("");
      setRole("reader");
      setPassword("");
      setLevel("Subscriber");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with specified role and permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
                minLength={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                type="email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
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
            <div>
              <label className="text-sm font-medium">Level</label>
              <Select value={level} onValueChange={(value) => setLevel(value as UserLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literary Experts">Literary Experts</SelectItem>
                  <SelectItem value="Aspiring Writers">Aspiring Writers</SelectItem>
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
