import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, MapPin, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Check if user is registered
  const { data: registration } = useQuery({
    queryKey: ["registration", event.id, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", event.id)
        .eq("user_id", session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user.id,
  });

  // Register for event mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Must be logged in to register");
      
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: event.id,
          user_id: session.user.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration", event.id] });
      toast({
        title: "Success",
        description: "You have successfully registered for this event",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Unregister from event mutation
  const unregisterMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Must be logged in to unregister");
      
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", event.id)
        .eq("user_id", session.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration", event.id] });
      toast({
        title: "Success",
        description: "You have successfully unregistered from this event",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleRegistration = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setIsRegistering(true);
    try {
      if (registration) {
        await unregisterMutation.mutateAsync();
      } else {
        await registerMutation.mutateAsync();
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.origin + `/events/${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copied",
          description: "Event link has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4 transition-all duration-300 hover:scale-[1.02]">
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
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant={registration ? "destructive" : "default"}
          onClick={handleRegistration}
          disabled={isRegistering}
          className="flex-1"
        >
          {isRegistering ? "Processing..." : registration ? "Unregister" : "Register"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}