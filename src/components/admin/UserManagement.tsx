
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
type UserWithRole = Profile & { role: AppRole };

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
    updateUserProfile,
    handleDeleteUser,
    handleAddUser,
    isAddingUser,
  } = useUserManagement();

  const { session } = useSession();
  const { data: userRoles } = useUserRoles(session?.user?.id);
  const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
  const { toast } = useToast();

  const handleProfileUpdate = async (profile: Partial<Profile> & { featured?: boolean }) => {
    try {
      await updateUserProfile(profile);

      if (profile.id && selectedUser?.user_type === 'writer' && 'featured' in profile) {
        const { error } = await supabase
          .from('writers')
          .update({
            featured: profile.featured,
            featured_month: profile.featured ? new Date().toISOString().substring(0, 7) : null
          })
          .eq('id', profile.id);

        if (error) throw error;
      }

      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      });
    }
  };

  const handleEditUser = (user: UserWithRole) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditLevel(user.level as UserLevel);
    setEditDialogOpen(true);
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
        onEdit={handleEditUser}
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
            email={selectedUser.email || ''}
          />

          <ProfileDialog
            profile={selectedUser}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleProfileUpdate}
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
