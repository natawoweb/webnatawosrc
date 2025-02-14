
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventInfoProps {
  event: Event;
}

export function EventInfo({ event }: EventInfoProps) {
  // Get user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Convert event time to UTC
  const eventDateTime = `${event.date}T${event.time}`;
  const eventInUTC = fromZonedTime(eventDateTime, 'America/New_York'); // Events are stored in EST
  
  // Format the date and time in user's local timezone
  const localDate = formatInTimeZone(eventInUTC, userTimeZone, 'MMMM d, yyyy');
  const localTime = formatInTimeZone(eventInUTC, userTimeZone, 'h:mm a');
  
  // Format EST time for reference
  const estTime = formatInTimeZone(eventInUTC, 'America/New_York', 'h:mm a z');

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {localDate}
      </p>
      <p className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {localTime} ({userTimeZone})
        <span className="text-xs">({estTime})</span>
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
