import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export function UpcomingEvents() {
  const navigate = useNavigate();

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us at our upcoming literary events and gatherings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsLoading ? (
            <div className="col-span-3 text-center">Loading events...</div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="glass-card p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]"
              >
                {event.gallery && Array.isArray(event.gallery) && event.gallery.length > 0 && (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <img
                      src={event.gallery[0] as string}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.date), "MMMM d, yyyy")}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.current_participants} / {event.max_participants} participants
                  </p>
                </div>
                <p className="line-clamp-2 text-muted-foreground">
                  {event.description}
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground">
              No upcoming events at the moment.
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/events")}
            className="group"
          >
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}