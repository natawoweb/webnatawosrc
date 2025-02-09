
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

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      return roles?.role;
    },
  });

  const canCreateEvents = userRole === 'admin' || userRole === 'manager';

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
