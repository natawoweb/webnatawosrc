
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTableHeader() {
  return (
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
  );
}
