
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export function useEventRegistration(event: Event, session: any | null, setIsProcessing: (value: boolean) => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    registerMutation,
    unregisterMutation
  };
}
