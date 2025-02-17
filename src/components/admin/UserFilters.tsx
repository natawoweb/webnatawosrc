
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  onAddUser: () => void;
  isAdmin: boolean;
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  onAddUser,
  isAdmin,
}: UserFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-[200px]">
        <Select value={selectedRole || "all"} onValueChange={onRoleChange}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by role" />
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
      {isAdmin && (
        <Button onClick={onAddUser}>Add User</Button>
      )}
    </div>
  );
}
