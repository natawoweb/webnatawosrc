
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile, AppRole, AddUserParams } from "@/types/user-management";
import type { UserLevel } from "@/integrations/supabase/types/models";

export function useUserMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile: " + error.message,
      });
    },
  });

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
      // First, update the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (roleError) {
        console.error('Role update error:', roleError);
        throw roleError;
      }

      // Then update level in profile if provided
      if (level) {
        const { error: levelError } = await supabase
          .from('profiles')
          .update({ level })
          .eq('id', userId);

        if (levelError) {
          console.error('Level update error:', levelError);
          throw levelError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast({
        title: "Success",
        description: "User role and level updated successfully",
      });
    },
    onError: (error) => {
      console.error('User update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user: " + error.message,
      });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async ({ email, fullName, role, password, level }: AddUserParams) => {
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
    },
    onError: (error) => {
      console.error('User deletion error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user: " + error.message,
      });
    },
  });

  return {
    updateProfileMutation,
    updateUserMutation,
    addUserMutation,
    deleteUserMutation,
  };
}
