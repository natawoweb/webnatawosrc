
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Calendar, Users, MapPin, Pencil, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useState } from "react";

interface EventListProps {
  onEdit: (event: any) => void;
  searchQuery?: string;
}

export function EventList({ onEdit, searchQuery = "" }: EventListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("events")
        .select("*")
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      // Apply search filter if search query exists
      if (searchQuery) {
        query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Sort with upcoming events first, then by date desc
      return data.sort((a, b) => {
        // First sort by upcoming status
        if (a.is_upcoming && !b.is_upcoming) return -1;
        if (!a.is_upcoming && b.is_upcoming) return 1;
        
        // Then sort by date
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const paginatedEvents = events?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEvents?.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                {format(new Date(event.date), "MMM d, yyyy")}
                <br />
                <span className="text-sm text-muted-foreground">
                  {event.time}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {event.current_participants}/{event.max_participants}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={event.is_upcoming ? "default" : "secondary"}>
                  {event.is_upcoming ? "Upcoming" : "Past"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={events?.length || 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
