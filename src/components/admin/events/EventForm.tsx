import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EventFormHeader } from "./form/EventFormHeader";
import { EventDateTime } from "./form/EventDateTime";
import { EventLocation } from "./form/EventLocation";
import { EventGallery } from "./form/EventGallery";
import { EventCategories } from "./form/EventCategories";

interface EventFormData {
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
  initialData?: EventFormData & { id?: string };
  onSuccess: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<EventFormData>(
    initialData || {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      max_participants: 0,
      gallery: [],
      category_id: null,
      tags: [],
    }
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const uploadedGallery = [];
      
      for (const image of selectedImages) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        uploadedGallery.push(publicUrl);
      }

      const { data: event, error } = await supabase
        .from("events")
        .insert([
          {
            ...data,
            gallery: uploadedGallery,
            current_participants: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      onSuccess();
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData & { id: string }) => {
      const { id, ...eventData } = data;
      const uploadedGallery = [...(eventData.gallery || [])];
      
      for (const image of selectedImages) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        uploadedGallery.push(publicUrl);
      }

      const { data: event, error } = await supabase
        .from("events")
        .update({
          ...eventData,
          gallery: uploadedGallery,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      onSuccess();
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData?.id) {
      updateEventMutation.mutate({ ...formData, id: initialData.id });
    } else {
      createEventMutation.mutate(formData);
    }
  };

  const handleImageSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleImageRemove = (index: number) => {
    if (initialData?.id) {
      setFormData(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
      }));
    } else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />

      <Button type="submit" className="w-full">
        {initialData?.id ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
}