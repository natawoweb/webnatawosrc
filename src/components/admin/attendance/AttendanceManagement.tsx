
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { AttendanceList } from "./AttendanceList";

export function AttendanceManagement() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Attendance Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Events List Panel */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-card">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedEvent === event.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No events found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Attendance List Panel */}
        <div className="md:col-span-2">
          {selectedEvent ? (
            <AttendanceList
              eventId={selectedEvent}
              participants={participants || []}
              isLoading={participantsLoading}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-300px)] border rounded-lg">
              <p className="text-muted-foreground">
                Select an event to view attendance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
