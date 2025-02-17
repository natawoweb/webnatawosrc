
import { type Database } from "@/integrations/supabase/types";
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
import { Trash2, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserTableProps {
  users: (Profile & { role: AppRole })[];
  isLoading: boolean;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onEdit: (user: Profile & { role: AppRole }) => void;
  isAdmin: boolean;
}

export function UserTable({ 
  users, 
  isLoading, 
  onDelete, 
  onEdit,
  isAdmin 
}: UserTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Level</TableHead>
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
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
              {user.level ? (
                <Badge variant="secondary">{user.level}</Badge>
              ) : (
                <span className="text-muted-foreground text-sm">Not set</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {isAdmin && user.user_type === 'writer' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Star className="h-4 w-4 text-yellow-500" />
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
