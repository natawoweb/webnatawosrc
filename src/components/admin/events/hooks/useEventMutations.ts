
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventFormData } from "../types/event.types";
import { uploadImages } from "./useImageUpload";

export function useEventMutations(
  selectedImages: File[],
  setSelectedImages: (images: File[]) => void,
  onSuccess?: () => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      console.log("Starting event creation process...");
      console.log("Form data being submitted:", data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("User not authenticated");
      }
      console.log("Authenticated user:", user.id);

      // Check admin or manager role
      const { data: hasRole, error: roleError } = await supabase.rpc('has_role', {
        user_id: user.id,
        required_role: 'admin'
      });

      const { data: hasManagerRole, error: managerRoleError } = await supabase.rpc('has_role', {
        user_id: user.id,
        required_role: 'manager'
      });

      if (roleError || managerRoleError) {
        console.error("Error checking user roles:", roleError || managerRoleError);
        throw new Error("Error verifying permissions");
      }

      if (!hasRole && !hasManagerRole) {
        console.error("User does not have required role");
        throw new Error("Insufficient permissions");
      }

      console.log("User role verified:", hasRole || hasManagerRole);

      // Upload new images if any
      let galleryUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log("Uploading new images...");
        try {
          galleryUrls = await uploadImages(selectedImages);
          console.log("Images uploaded successfully:", galleryUrls);
        } catch (error) {
          console.error("Error uploading images:", error);
          throw new Error("Failed to upload images");
        }
      }

      // Prepare event data
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        max_participants: data.max_participants,
        gallery: [...(data.gallery || []), ...galleryUrls],
        created_by: user.id,
        category_id: data.category_id,
        current_participants: 0,
        is_upcoming: true,
        tags: data.tags
      };

      console.log("Sending event data to Supabase:", eventData);

      const { data: result, error } = await supabase
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error("Database error during event creation:", error);
        throw error;
      }

      console.log("Event created successfully:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Event creation success. Invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      setSelectedImages([]); // Clear selected images after successful creation
      if (onSuccess) {
        console.log("Calling onSuccess callback...");
        onSuccess();
      }
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
      console.log("Starting event update process...");
      if (!data.id) {
        throw new Error("Event ID is required for updates");
      }

      // Upload new images if any
      let galleryUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log("Uploading new images for event update...");
        try {
          galleryUrls = await uploadImages(selectedImages);
          console.log("New images uploaded successfully:", galleryUrls);
        } catch (error) {
          console.error("Error uploading images:", error);
          throw new Error("Failed to upload images");
        }
      }

      // Combine existing gallery with new uploaded images
      const updatedGallery = [...(data.gallery || []), ...galleryUrls];
      console.log("Updated gallery:", updatedGallery);
      
      const { data: result, error } = await supabase
        .from("events")
        .update({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          location: data.location,
          max_participants: data.max_participants,
          gallery: updatedGallery,
          category_id: data.category_id,
          tags: data.tags
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating event:", error);
        throw error;
      }

      console.log("Event updated successfully:", result);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      setSelectedImages([]); // Clear selected images after successful update
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
    createEventMutation,
    updateEventMutation,
  };
}
