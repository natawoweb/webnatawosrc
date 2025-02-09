
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("events")
        .insert([{ ...data, created_by: user.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event: " + error.message,
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!data.id) throw new Error("Event ID is required for updates");
      
      const { error } = await supabase
        .from("events")
        .update(data)
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event: " + error.message,
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
