
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type Database } from "@/integrations/supabase/types";
import { UserTableActions } from "./UserTableActions";

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface UserTableRowProps {
  user: Profile & { role: AppRole };
  isAdmin: boolean;
  onEdit: (user: Profile & { role: AppRole }) => void;
  onDelete: (user: Profile & { role: AppRole }) => void;
  onFeature: (user: Profile & { role: AppRole }) => void;
  isFeatured: boolean;
}

export function UserTableRow({
  user,
  isAdmin,
  onEdit,
  onDelete,
  onFeature,
  isFeatured,
}: UserTableRowProps) {
  return (
    <TableRow>
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
        <UserTableActions
          user={user}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onFeature={onFeature}
          isFeatured={isFeatured}
        />
      </TableCell>
    </TableRow>
  );
}
