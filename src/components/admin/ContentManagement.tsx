import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCog, Trash2, User } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
type AppRole = Database["public"]["Enums"]["app_role"];

type UserWithRole = Profile & {
  role: AppRole;
};

export function ContentManagement() {
  const { toast } = useToast();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .returns<Profile[]>();

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .returns<UserRole[]>();

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = profiles.map(profile => ({
        ...profile,
        role: userRoles.find(ur => ur.user_id === profile.id)?.role || "reader"
      }));

      return usersWithRoles;
    },
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await refetch();
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Only admins can delete users.",
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: AppRole) => {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getRoleBadge = (role: AppRole) => {
    const baseClasses = "inline-flex items-center gap-1";
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive" className={baseClasses}>
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        );
      case "manager":
        return (
          <Badge variant="default" className={baseClasses}>
            <UserCog className="h-3 w-3" />
            Manager
          </Badge>
        );
      case "writer":
        return (
          <Badge variant="secondary" className={baseClasses}>
            <UserCheck className="h-3 w-3" />
            Writer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className={baseClasses}>
            <User className="h-3 w-3" />
            Reader
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button>
          <User className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search users by email..."
            className="w-full"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="reader">Reader</SelectItem>
            <SelectItem value="writer">Writer</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.created_at || "").toLocaleDateString()}
              </TableCell>
              <TableCell>
                {getRoleBadge(user.role)}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const nextRole: Record<AppRole, AppRole> = {
                      reader: "writer",
                      writer: "manager",
                      manager: "admin",
                      admin: "reader"
                    };
                    handleUpdateRole(user.id, nextRole[user.role]);
                  }}
                >
                  <UserCog className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}