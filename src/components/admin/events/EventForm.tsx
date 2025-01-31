import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventFormHeader } from "./form/EventFormHeader";
import { EventDateTime } from "./form/EventDateTime";
import { EventLocation } from "./form/EventLocation";
import { EventGallery } from "./form/EventGallery";
import { EventCategories } from "./form/EventCategories";

interface EventFormData {
  id?: string;  // Make id optional since it's not required for new events
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

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSuccess?: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
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
      const { error } = await supabase
        .from("events")
        .insert([data]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const uploadPromises = selectedImages.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const galleryUrls = [...formData.gallery, ...uploadedUrls];

      const eventData = {
        ...formData,
        gallery: galleryUrls,
      };

      if (formData.id) {
        await updateEventMutation.mutateAsync(eventData);
      } else {
        await createEventMutation.mutateAsync(eventData);
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <EventFormHeader
        title={formData.title}
        description={formData.description}
        onTitleChange={(value) => setFormData({ ...formData, title: value })}
        onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
      />

      <EventDateTime
        date={formData.date}
        time={formData.time}
        onDateChange={(value) => setFormData({ ...formData, date: value })}
        onTimeChange={(value) => setFormData({ ...formData, time: value })}
      />

      <EventLocation
        location={formData.location}
        maxParticipants={formData.max_participants}
        onLocationChange={(value) => setFormData({ ...formData, location: value })}
        onMaxParticipantsChange={(value) => setFormData({ ...formData, max_participants: value })}
      />

      <EventCategories
        categoryId={formData.category_id}
        tags={formData.tags}
        onCategoryChange={(value) => setFormData({ ...formData, category_id: value })}
        onTagsChange={(value) => setFormData({ ...formData, tags: value })}
      />

      <EventGallery
        initialGallery={formData.gallery}
        selectedImages={selectedImages}
        onImageSelect={setSelectedImages}
        onImageRemove={(index) => {
          const newImages = [...selectedImages];
          newImages.splice(index, 1);
          setSelectedImages(newImages);
        }}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          disabled={createEventMutation.isPending || updateEventMutation.isPending}
        >
          {formData.id ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}