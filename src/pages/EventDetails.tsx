
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { EventCard } from "@/components/home/upcoming-events/EventCard";
import { EventComments } from "@/components/events/comments/EventComments";
import { EventRatingAndComments } from "@/components/events/EventRatingAndComments";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Event = Database["public"]["Tables"]["events"]["Row"];

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("Back", "பின் செல்க")}
        </Button>
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="mt-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("Back", "பின் செல்க")}
        </Button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("Event not found", "நிகழ்வு கிடைக்கவில்லை")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {t(
              "The event you're looking for doesn't exist or has been removed.",
              "நீங்கள் தேடும் நிகழ்வு இல்லை அல்லது நீக்கப்பட்டுள்ளது."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t("Back", "பின் செல்க")}
      </Button>
      
      {event.gallery && Array.isArray(event.gallery) && event.gallery.length > 0 && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={event.gallery[0] as string}
            alt={event.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}
      
      <div className="space-y-8">
        <div className="bg-background">
          <EventCard event={event} />
        </div>

        <div className="bg-background p-6 rounded-lg">
          <EventRatingAndComments event={event} />
        </div>
        
        <div className="bg-background p-6 rounded-lg">
          <EventComments eventId={event.id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
