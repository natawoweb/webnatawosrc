
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
import { Calendar, Users, MapPin, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useState } from "react";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { useToast } from "@/hooks/use-toast";

interface EventListProps {
  onEdit: (event: any) => void;
  searchQuery?: string;
}

export function EventList({ onEdit, searchQuery = "" }: EventListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("events")
        .select("*")
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (searchQuery) {
        query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const now = new Date();
        return {
          ...event,
          is_upcoming: eventDateTime > now
        };
      }).sort((a, b) => {
        if (a.is_upcoming && !b.is_upcoming) return -1;
        if (!a.is_upcoming && b.is_upcoming) return 1;
        
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", selectedEvent.id);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedEvent(event);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

      <DeleteEventDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        event={selectedEvent}
      />
    </div>
  );
}
