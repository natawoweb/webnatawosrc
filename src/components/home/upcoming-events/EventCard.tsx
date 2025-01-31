import { Database } from "@/integrations/supabase/types";
import { EventInfo } from "./EventInfo";
import { EventActions } from "./EventActions";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventCardProps {
  event: Event;
  showImage?: boolean;
}

export function EventCard({ event, showImage = false }: EventCardProps) {
  return (
    <div className="glass-card p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <EventInfo event={event} />
      <p className="line-clamp-2 text-muted-foreground">
        {event.description}
      </p>
      <EventActions event={event} />
    </div>
  );
}