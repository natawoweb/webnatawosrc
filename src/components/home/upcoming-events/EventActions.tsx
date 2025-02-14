
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventActionsProps {
  event: Event;
}

export function EventActions({ event }: EventActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const eventDateTime = new Date(`${event.date}T${event.time}`);
  const isPastEvent = new Date() > eventDateTime;

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

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Must be logged in to register");
      
      const { data, error } = await supabase.rpc('register_for_event', {
        p_event_id: event.id,
        p_user_id: session.user.id
      });
      
      if (error) throw error;
      return data;
    },
    onMutate: () => {
      // Optimistically update UI
      queryClient.setQueryData(["registration", event.id, session?.user.id], { id: 'temp' });
      queryClient.setQueryData(
        ["event", event.id],
        (oldData: Event | undefined) => oldData ? {
          ...oldData,
          current_participants: (oldData.current_participants || 0) + 1
        } : oldData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast({
        title: "Success",
        description: "You have successfully registered for this event",
      });
    },
    onError: (error) => {
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: ["registration", event.id, session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Must be logged in to unregister");
      
      const { data, error } = await supabase.rpc('unregister_from_event', {
        p_event_id: event.id,
        p_user_id: session.user.id
      });
      
      if (error) throw error;
      return data;
    },
    onMutate: () => {
      // Optimistically update UI
      queryClient.setQueryData(["registration", event.id, session?.user.id], null);
      queryClient.setQueryData(
        ["event", event.id],
        (oldData: Event | undefined) => oldData ? {
          ...oldData,
          current_participants: Math.max((oldData.current_participants || 1) - 1, 0)
        } : oldData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast({
        title: "Success",
        description: "You have successfully unregistered from this event",
      });
    },
    onError: (error) => {
      // Revert optimistic updates on error
      queryClient.invalidateQueries({ queryKey: ["registration", event.id, session?.user.id] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  const handleRegistration = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }
    
    if (isProcessing) return; // Prevent multiple clicks
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
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
