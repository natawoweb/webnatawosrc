
import { useState } from "react";
import type { UserWithRole, AppRole } from "@/types/user-management";
import type { UserLevel } from "@/integrations/supabase/types/models";
import { useUserQueries } from "./user-management/useUserQueries";
import { useUserMutations } from "./user-management/useUserMutations";

export function useUserManagement() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [editRole, setEditRole] = useState<AppRole>("reader");
  const [editLevel, setEditLevel] = useState<UserLevel | undefined>(undefined);

  const { data: users, isLoading } = useUserQueries();
  const { 
    updateProfileMutation,
    updateUserMutation,
    addUserMutation,
    deleteUserMutation
  } = useUserMutations();

  const updateUserRole = (userId: string, role: AppRole, level?: UserLevel) => {
    updateUserMutation.mutate({ userId, role, level });
  };

  const updateUserProfile = (profile: Partial<UserWithRole>) => {
    updateProfileMutation.mutate(profile);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const handleAddUser = async (email: string, fullName: string, role: AppRole, password: string, level: UserLevel) => {
    await addUserMutation.mutateAsync({ email, fullName, role, password, level });
  };

  const filteredUsers = users?.filter((user) => {
    const matchesRole = selectedRole === "all" || !selectedRole ? true : user.role === selectedRole;
    const matchesSearch = searchQuery
      ? user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  return {
    users: filteredUsers,
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
    updateUserProfile,
    handleDeleteUser,
    handleAddUser,
    isAddingUser: addUserMutation.isPending,
  };
}

