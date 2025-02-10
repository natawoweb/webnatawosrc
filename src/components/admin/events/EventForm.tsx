
import { EventFormHeader } from "./form/EventFormHeader";
import { EventDateTime } from "./form/EventDateTime";
import { EventLocation } from "./form/EventLocation";
import { EventGallery } from "./form/EventGallery";
import { EventCategories } from "./form/EventCategories";
import { useEventForm, EventFormData } from "./hooks/useEventForm";
import { uploadImages } from "./hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSuccess?: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const {
    formData,
    setFormData,
    selectedImages,
    setSelectedImages,
    createEventMutation,
    updateEventMutation,
  } = useEventForm({ initialData, onSuccess });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started", { formData });
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.max_participants) {
      console.error("Missing required fields", {
        title: !!formData.title,
        description: !!formData.description,
        date: !!formData.date,
        time: !!formData.time,
        location: !!formData.location,
        max_participants: !!formData.max_participants
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      console.log("Uploading images...", { selectedImages });
      const uploadedUrls = await uploadImages(selectedImages);
      console.log("Images uploaded successfully", { uploadedUrls });
      
      const galleryUrls = [...(formData.gallery || []), ...uploadedUrls];
      console.log("Combined gallery URLs", { galleryUrls });

      const eventData = {
        ...formData,
        gallery: galleryUrls,
      };
      console.log("Preparing to submit event data", { eventData });

      if (formData.id) {
        console.log("Updating existing event", { id: formData.id });
        await updateEventMutation.mutateAsync(eventData);
      } else {
        console.log("Creating new event");
        await createEventMutation.mutateAsync(eventData);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event. Please try again.",
      });
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
        <Button
          type="submit"
          disabled={createEventMutation.isPending || updateEventMutation.isPending}
        >
          {formData.id ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
