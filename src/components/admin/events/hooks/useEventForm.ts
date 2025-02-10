
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  gallery: string[];
  category_id: string | null;
  tags: string[];
}

interface UseEventFormProps {
  initialData?: Partial<EventFormData>;
  onSuccess?: () => void;
}

export function useEventForm({ initialData, onSuccess }: UseEventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    max_participants: initialData?.max_participants || 0,
    gallery: initialData?.gallery || [],
    category_id: initialData?.category_id || null,
    tags: initialData?.tags || [],
    ...(initialData?.id ? { id: initialData.id } : {}),
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      console.log("Creating event with data:", { data });
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user context:", { userId: user?.id });
      
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("User not authenticated");
      }

      // Log the exact data being sent to Supabase
      const eventData = { ...data, created_by: user.id };
      console.log("Sending to Supabase:", eventData);

      const { data: result, error } = await supabase
        .from("events")
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error("Database error during event creation:", error);
        throw error;
      }

      console.log("Event created successfully:", { result });
      return result;
    },
    onSuccess: (data) => {
      console.log("Event creation success callback:", { data });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Event creation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to create event",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      console.log("Updating event with data:", { data });
      
      if (!data.id) {
        console.error("No event ID provided for update");
        throw new Error("Event ID is required for updates");
      }
      
      const { data: result, error } = await supabase
        .from("events")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        console.error("Database error during event update:", error);
        throw error;
      }

      console.log("Event updated successfully:", { result });
      return result;
    },
    onSuccess: (data) => {
      console.log("Event update success callback:", { data });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Event update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to update event",
      });
    },
  });

  return {
    formData,
    setFormData,
    selectedImages,
    setSelectedImages,
    createEventMutation,
    updateEventMutation,
  };
}
