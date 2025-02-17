
import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/events/comments/CommentForm";
import { CommentItem } from "@/components/events/comments/CommentItem";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useSession } from "@/hooks/useSession";
import { useLanguage } from "@/contexts/LanguageContext";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventRatingAndCommentsProps {
  event: Event;
}

export function EventRatingAndComments({ event }: EventRatingAndCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hoveredRating, setHoveredRating] = useState(0);
  const { session } = useSession();
  const { t } = useLanguage();

  const { data: userRating } = useQuery({
    queryKey: ["eventRating", event.id, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data } = await supabase
        .from("event_ratings")
        .select("rating")
        .eq("event_id", event.id)
        .eq("user_id", session.user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { data: averageRating } = useQuery({
    queryKey: ["eventAverageRating", event.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("event_ratings")
        .select("rating")
        .eq("event_id", event.id);
      if (!data?.length) return 0;
      const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
      return sum / data.length;
    },
  });

  const rateMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!session?.user.id) throw new Error(t(
        "Must be logged in to rate",
        "மதிப்பிட உள்நுழைய வேண்டும்"
      ));
      
      // First try to update any existing rating
      const { data: existingRating, error: fetchError } = await supabase
        .from("event_ratings")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from("event_ratings")
          .update({ rating })
          .eq("id", existingRating.id);
        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase
          .from("event_ratings")
          .insert({
            event_id: event.id,
            user_id: session.user.id,
            rating,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRating"] });
      queryClient.invalidateQueries({ queryKey: ["eventAverageRating"] });
      toast({
        title: t("Success", "வெற்றி"),
        description: t(
          "Your rating has been submitted",
          "உங்கள் மதிப்பீடு சமர்ப்பிக்கப்பட்டது"
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t("Error", "பிழை"),
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {t("Event Rating", "நிகழ்வு மதிப்பீடு")}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className="p-1 hover:scale-110 transition-transform"
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => rateMutation.mutate(rating)}
                disabled={!session}
              >
                {rating <= (hoveredRating || userRating?.rating || 0) ? (
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="w-6 h-6" />
                )}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {t("Average:", "சராசரி:")} {averageRating?.toFixed(1) || t("No ratings yet", "இதுவரை மதிப்பீடுகள் இல்லை")}
          </span>
        </div>
        {!session && (
          <p className="text-sm text-muted-foreground">
            {t(
              "Please log in to rate this event",
              "இந்த நிகழ்வை மதிப்பிட உள்நுழையவும்"
            )}
          </p>
        )}
      </div>
    </div>
  );
}
