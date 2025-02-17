
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { EventCalendar } from "@/components/events/EventCalendar";
import { Loader2, LayoutGrid, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [view, setView] = useState<"grid" | "calendar">("grid");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", showUpcoming],
    queryFn: async () => {
      const now = new Date();
      const todayDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0];

      const query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (showUpcoming) {
        query.or(`date.gt.${todayDate},and(date.eq.${todayDate},time.gt.${currentTime})`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <EventsHeader />
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <EventFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterUpcoming={() => setShowUpcoming(!showUpcoming)}
            showingUpcoming={showUpcoming}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("calendar")}
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : view === "grid" ? (
        filteredEvents && filteredEvents.length > 0 ? (
          <EventGrid events={filteredEvents} />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No events found. Please try adjusting your search criteria.
            </p>
          </div>
        )
      ) : (
        <EventCalendar />
      )}
    </div>
  );
};

export default Events;
