
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventForm } from "./events/EventForm";
import { EventList } from "./events/EventList";
import { supabase } from "@/integrations/supabase/client";

export function EventManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      console.log("Fetching user role...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        return null;
      }
      console.log("Current user:", user);

      const { data: hasAdminRole, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        required_role: 'admin'
      });

      if (error) {
        console.error("Error checking admin role:", error);
        return null;
      }

      console.log("Has admin role:", hasAdminRole);
      return hasAdminRole ? 'admin' : null;
    },
  });

  const handleEdit = (event: any) => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      max_participants: event.max_participants,
      gallery: event.gallery || [],
      category_id: event.category_id,
      tags: event.tags || [],
    });
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setEditingEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const canCreateEvents = userRole === 'admin';

  if (!canCreateEvents) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          You don't have permission to manage events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-120px)] pr-4">
              <EventForm
                initialData={editingEvent}
                onSuccess={handleDialogClose}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <EventList onEdit={handleEdit} />
    </div>
  );
}
