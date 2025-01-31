import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterUpcoming: () => void;
  showingUpcoming: boolean;
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  onFilterUpcoming,
  showingUpcoming,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button
        variant={showingUpcoming ? "default" : "outline"}
        onClick={onFilterUpcoming}
        className="w-full sm:w-auto"
      >
        <Filter className="mr-2 h-4 w-4" />
        {showingUpcoming ? "Showing Upcoming" : "Show All"}
      </Button>
    </div>
  );
}