import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import { type Database } from "@/integrations/supabase/types";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

type UserWithRole = Profile & {
  role: AppRole;
};

export function UserManagement() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [editRole, setEditRole] = useState<AppRole>("reader");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = profiles.map(profile => {
        const userRole = userRoles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "reader"
        };
      });

      return usersWithRoles;
    },
  });

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: userId, 
          role: newRole 
        });

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Role updated",
        description: "User role has been successfully updated.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await refetch();
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Only admins can delete users.",
      });
    }
  };

  const handleAddUser = async (email: string, fullName: string, role: AppRole) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: "tempPassword123",
        email_confirm: true,
        user_metadata: { full_name: fullName }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ 
            user_id: authData.user.id, 
            role
          });

        if (roleError) throw roleError;
      }

      await refetch();
      
      toast({
        title: "User added",
        description: "New user has been successfully created.",
      });
      
      setAddUserDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user. Please try again.",
      });
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesRole = selectedRole === "all" || !selectedRole ? true : user.role === selectedRole;
    const matchesSearch = searchQuery
      ? user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

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
        users={filteredUsers || []}
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
      />
    </div>
  );
}
