import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventGridProps {
  events: Event[];
}

export function EventGrid({ events }: EventGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
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
      ))}
    </div>
  );
}