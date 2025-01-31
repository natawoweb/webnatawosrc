import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventImageProps {
  event: Event;
}

export function EventImage({ event }: EventImageProps) {
  if (!event.gallery || !Array.isArray(event.gallery) || event.gallery.length === 0) {
    return null;
  }

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg">
      <img
        src={event.gallery[0] as string}
        alt={event.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}