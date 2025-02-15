
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceList } from "./AttendanceList";
import { useState } from "react";

export function AttendanceManagement() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ["event-participants", selectedEvent],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", selectedEvent);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedEvent,
  });

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Event Attendance Management</h2>
        {events && events.length > 0 ? (
          <Tabs
            defaultValue={events[0].id}
            onValueChange={(value) => setSelectedEvent(value)}
          >
            <TabsList className="w-full h-full flex-wrap">
              {events.map((event) => (
                <TabsTrigger key={event.id} value={event.id} className="flex-grow">
                  {event.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {events.map((event) => (
              <TabsContent key={event.id} value={event.id}>
                <AttendanceList
                  eventId={event.id}
                  participants={participants || []}
                  isLoading={participantsLoading}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No events found
          </div>
        )}
      </div>
    </div>
  );
}
