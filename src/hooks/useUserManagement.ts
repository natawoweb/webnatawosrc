import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type Database } from "@/integrations/supabase/types";

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

  // Fetch users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;

      return profiles.map(profile => {
        const userRole = userRoles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "reader"
        };
      });
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role: " + error.message,
      });
    },
  });

  // Add new user mutation using the Edge Function
  const addUserMutation = useMutation({
    mutationFn: async ({ email, fullName, role }: { email: string; fullName: string; role: AppRole }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await fetch(
        'https://yqqfxpvptgcczumqowpc.supabase.co/functions/v1/create-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email, fullName, role }),
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
      console.error('Mutation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add user",
      });
    },
  });

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

  const updateUserRole = (userId: string, role: AppRole) => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const handleAddUser = async (email: string, fullName: string, role: AppRole) => {
    await addUserMutation.mutateAsync({ email, fullName, role });
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
    updateUserRole,
    handleDeleteUser,
    handleAddUser,
    isAddingUser: addUserMutation.isPending,
  };
}
