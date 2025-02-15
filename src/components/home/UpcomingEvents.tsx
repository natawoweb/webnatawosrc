
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "./upcoming-events/EventCard";
import { EventsHeader } from "./upcoming-events/EventsHeader";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export function UpcomingEvents() {
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_upcoming", true)
        .order("date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as Event[];
    },
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <EventsHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsLoading ? (
            <div className="col-span-3 text-center">Loading events...</div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground">
              No upcoming events at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
