
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

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

type UserWithRole = Profile & {
  role: AppRole;
};

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
    updateUserProfile,
  } = useUserManagement();

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleLevelChange = (level: UserLevel) => {
    setEditLevel(level);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      <UserTable
        users={users || []}
        onEdit={(user) => {
          setSelectedUser(user);
          setEditRole(user.role);
          setEditLevel(user.level as UserLevel);
          setEditDialogOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteDialogOpen(true);
        }}
        onView={(user) => {
          setSelectedUser(user);
          setProfileDialogOpen(true);
        }}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
      />

      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={updateUserRole}
        selectedRole={editRole}
        selectedLevel={editLevel}
        onRoleChange={setEditRole}
        onLevelChange={handleLevelChange}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSubmit={handleAddUser}
        isLoading={isAddingUser}
      />

      <ProfileDialog
        profile={selectedUser}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onSubmit={updateUserProfile}
        isAdmin={true}
      />
    </div>
  );
}
