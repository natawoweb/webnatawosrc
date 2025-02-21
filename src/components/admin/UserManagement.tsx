
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ProfileDialog } from "./ProfileDialog";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useState } from "react";
import { type Database } from "@/integrations/supabase/types";
import type { UserLevel } from "@/integrations/supabase/types/models";
import { useSession } from "@/hooks/useSession";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useToast } from "@/hooks/use-toast";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserFiltersProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;
  isAdmin: boolean;
}

interface UserTableProps {
  users: (Profile & { role: AppRole })[];
  isLoading: boolean;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onEdit: (user: Profile & { role: AppRole }) => void;
  isAdmin: boolean;
}

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  email: string;
}

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, fullName: string, role: AppRole, password: string, level: UserLevel) => Promise<void>;
  isSubmitting: boolean;
}

export function UserManagement() {
  const {
    users,
    isLoading,
    selectedRole,
    setSelectedRole,
    searchQuery,
    setSearchQuery,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    addUserDialogOpen,
    setAddUserDialogOpen,
    selectedUser,
    setSelectedUser,
    editRole,
    setEditRole,
    editLevel,
    setEditLevel,
    updateUserRole,
    handleDeleteUser,
    handleAddUser,
    isAddingUser,
  } = useUserManagement();

  const { session } = useSession();
  const { data: userRoles } = useUserRoles(session?.user?.id);
  const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
  const { toast } = useToast();

  const handleUpdateUser = async (userId: string, role: AppRole, level?: UserLevel) => {
    try {
      await updateUserRole(userId, role, level);
      setEditDialogOpen(false);
      toast({
        title: "Success",
        description: "User updated successfully"
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user"
      });
    }
  };

  return (
    <div className="space-y-4">
      <UserFilters
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddUser={() => setAddUserDialogOpen(true)}
        isAdmin={isAdmin}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteDialogOpen(true);
        }}
        onEdit={(user) => {
          setSelectedUser(user);
          setEditRole(user.role);
          setEditLevel(user.level as UserLevel);
          setEditDialogOpen(true);
        }}
        isAdmin={isAdmin}
      />

      {selectedUser && (
        <>
          <DeleteUserDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={() => {
              if (selectedUser) {
                handleDeleteUser(selectedUser.id);
                setDeleteDialogOpen(false);
              }
            }}
            email={selectedUser.email}
          />

          <ProfileDialog
            profile={selectedUser}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleUpdateUser}
            isAdmin={isAdmin}
          />
        </>
      )}

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSubmit={handleAddUser}
        isSubmitting={isAddingUser}
      />
    </div>
  );
}
