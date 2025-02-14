
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useEventRegistration } from "@/hooks/useEventRegistration";
import { useEventShare } from "@/hooks/useEventShare";
import { parseISO, isBefore } from "date-fns";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventActionsProps {
  event: Event;
}

export function EventActions({ event }: EventActionsProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleShare = useEventShare();
  
  const eventDateTime = parseISO(`${event.date}T${event.time}`);
  const isPastEvent = isBefore(eventDateTime, new Date());

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: registration, isLoading: isRegistrationLoading } = useQuery({
    queryKey: ["registration", event.id, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", event.id)
        .eq("user_id", session.user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!session?.user.id,
  });

  const { registerMutation, unregisterMutation } = useEventRegistration(event, session, setIsProcessing);

  const handleRegistration = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (registration) {
        await unregisterMutation.mutateAsync();
      } else {
        await registerMutation.mutateAsync();
      }
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const isButtonDisabled = 
    isProcessing || 
    isRegistrationLoading || 
    isPastEvent || 
    (!registration && event.current_participants >= (event.max_participants || 0));

  const buttonText = isPastEvent ? "Event Ended" : 
    isProcessing ? "Processing..." : 
    registration ? "Unregister" : 
    event.current_participants >= (event.max_participants || 0) ? "Full" :
    "Register";

  return (
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
        disabled={isButtonDisabled}
        className="flex-1"
      >
        {buttonText}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare(event.title, event.description, event.id)}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
