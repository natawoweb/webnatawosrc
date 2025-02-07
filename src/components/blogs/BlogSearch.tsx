
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
import { DatePicker } from "@/components/ui/date-picker";

interface BlogSearchProps {
  searchTerm: string;
  searchType: string;
  onSearchTermChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  dateFilter: Date | undefined;
  onDateFilterChange: (date: Date | undefined) => void;
  ratingFilter: string;
  onRatingFilterChange: (rating: string) => void;
}

export const BlogSearch = ({
  searchTerm,
  searchType,
  onSearchTermChange,
  onSearchTypeChange,
  dateFilter,
  onDateFilterChange,
  ratingFilter,
  onRatingFilterChange,
}: BlogSearchProps) => {
  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex gap-4">
        <div className="flex-1">
          <DatePicker
            value={dateFilter}
            onChange={onDateFilterChange}
            placeholder="Filter by date..."
          />
        </div>
        <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by rating..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
