import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { Loader2 } from "lucide-react";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", showUpcoming],
    queryFn: async () => {
      const query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (showUpcoming) {
        query.eq("is_upcoming", true);
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
      
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterUpcoming={() => setShowUpcoming(!showUpcoming)}
        showingUpcoming={showUpcoming}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <EventGrid events={filteredEvents} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No events found. Please try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;