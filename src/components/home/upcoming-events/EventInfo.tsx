import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventInfoProps {
  event: Event;
}

export function EventInfo({ event }: EventInfoProps) {
  return (
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
  );
}