
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogSearchProps {
  searchTerm: string;
  searchType: string;
  onSearchTermChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
}

export const BlogSearch = ({
  searchTerm,
  searchType,
  onSearchTermChange,
  onSearchTypeChange,
}: BlogSearchProps) => {
  return (
    <div className="flex gap-4">
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Search by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="author">Author</SelectItem>
          <SelectItem value="category">Category</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};
