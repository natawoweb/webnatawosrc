
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogStatus } from "@/integrations/supabase/types/content";

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BlogFiltersProps) {
  const blogStatuses: BlogStatus[] = [
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "published"
  ];

  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <Input
          placeholder="Search blogs by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {blogStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
