
import { type Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "./user-table/UserTableRow";
import { useFeaturedWriters } from "./user-table/useFeaturedWriters";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserTableProps {
  users: (Profile & { role: AppRole })[];
  isLoading: boolean;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onEdit: (user: Profile & { role: AppRole }, isViewMode: boolean) => void;
  isAdmin: boolean;
}

export function UserTable({ 
  users = [],
  isLoading, 
  onDelete, 
  onEdit,
  isAdmin 
}: UserTableProps) {
  const { featuredWriters, handleFeatureWriter } = useFeaturedWriters(users);

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
          <UserTableRow
            key={user.id}
            user={user}
            isAdmin={isAdmin}
            isFeatured={featuredWriters[user.id] || false}
            onEdit={(user, isViewMode) => onEdit(user, isViewMode)}
            onDelete={onDelete}
            onFeature={handleFeatureWriter}
          />
        ))}
      </TableBody>
    </Table>
  );
}
