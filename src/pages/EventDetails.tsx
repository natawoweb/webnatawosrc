import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { EventCard } from "@/components/home/upcoming-events/EventCard";
import { Skeleton } from "@/components/ui/skeleton";

type Event = Database["public"]["Tables"]["events"]["Row"];

const EventDetails = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Event;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <EventCard event={event} />
    </div>
  );
};

export default EventDetails;