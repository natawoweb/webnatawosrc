
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type BlogStatus = Database['public']['Enums']['blog_status'];

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: BlogStatus | "all" | null;
  onStatusChange: (value: BlogStatus | "all") => void;
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: BlogFiltersProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-[200px]">
        <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
