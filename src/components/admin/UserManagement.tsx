import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { useUserManagement } from "@/hooks/useUserManagement";

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
    updateUserRole,
    handleDeleteUser,
    handleAddUser,
    isAddingUser,
  } = useUserManagement();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
          setEditDialogOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteDialogOpen(true);
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
        onRoleChange={setEditRole}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSubmit={handleAddUser}
        isLoading={isAddingUser}
      />
    </div>
  );
}