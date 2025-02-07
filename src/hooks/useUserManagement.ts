
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";
import type { UserLevel } from "@/integrations/supabase/types/models";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

type UserWithRole = Profile & {
  role: AppRole;
};

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [editRole, setEditRole] = useState<AppRole>("reader");
  const [editLevel, setEditLevel] = useState<UserLevel | undefined>(undefined);

  // Fetch users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Then, get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      console.log('Fetched profiles:', profiles);
      console.log('Fetched user roles:', userRoles);

      // Combine profiles with their roles
      return profiles.map(profile => {
        const userRole = userRoles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "reader" as AppRole
        };
      });
    },
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile: " + error.message,
      });
    },
  });

  // Update user role and level mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      role, 
      level 
    }: { 
      userId: string; 
      role: AppRole; 
      level?: UserLevel 
    }) => {
      // Update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role 
        });

      if (roleError) throw roleError;

      // Update level in profile
      if (level) {
        const { error: levelError } = await supabase
          .from('profiles')
          .update({ level })
          .eq('id', userId);

        if (levelError) throw levelError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user: " + error.message,
      });
    },
  });

  const updateUserRole = (userId: string, role: AppRole, level?: UserLevel) => {
    updateUserMutation.mutate({ userId, role, level });
  };

  const updateUserProfile = (profile: Partial<Profile>) => {
    updateProfileMutation.mutate(profile);
  };

  // Add new user mutation using the Edge Function
  const addUserMutation = useMutation({
    mutationFn: async ({ email, fullName, role, password, level }: { 
      email: string; 
      fullName: string; 
      role: AppRole;
      password: string;
      level: UserLevel;
    }) => {
      const response = await fetch(
        'https://yqqfxpvptgcczumqowpc.supabase.co/functions/v1/create-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, fullName, role, password, level }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.message || 'Failed to create user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "User added successfully",
      });
      setAddUserDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error adding user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add user",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user: " + error.message,
      });
    },
  });

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
