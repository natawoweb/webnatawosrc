
import { useState } from "react";
import { EventFormData, UseEventFormProps } from "@/components/admin/events/types/event.types";
import { useEventMutations } from "@/components/admin/events/hooks/useEventMutations";

export function useEventForm({ initialData, onSuccess }: UseEventFormProps) {
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

  const { createEventMutation, updateEventMutation } = useEventMutations(
    selectedImages,
    setSelectedImages,
    onSuccess
  );

  return {
    formData,
    setFormData,
    selectedImages,
    setSelectedImages,
    createEventMutation,
    updateEventMutation,
  };
}

export type { EventFormData };
