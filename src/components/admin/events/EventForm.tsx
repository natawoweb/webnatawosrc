
import { EventFormHeader } from "./form/EventFormHeader";
import { EventDateTime } from "./form/EventDateTime";
import { EventLocation } from "./form/EventLocation";
import { EventGallery } from "./form/EventGallery";
import { EventCategories } from "./form/EventCategories";
import { useEventForm } from "@/hooks/useEventForm";
import type { EventFormData } from "@/components/admin/events/types/event.types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
    handleExistingImageRemove,
    createEventMutation,
    updateEventMutation,
  } = useEventForm({ initialData, onSuccess });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started - EventForm component");
    
    // Validate required fields
    const requiredFields = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      max_participants: formData.max_participants
    };

    console.log("Checking required fields:", requiredFields);

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    try {
      if (formData.id) {
        console.log("Updating existing event:", formData.id);
        await updateEventMutation.mutateAsync(formData);
      } else {
        console.log("Creating new event");
        await createEventMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
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
        onExistingImageRemove={handleExistingImageRemove}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={createEventMutation.isPending || updateEventMutation.isPending}
        >
          {createEventMutation.isPending || updateEventMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {formData.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            formData.id ? 'Update Event' : 'Create Event'
          )}
        </Button>
      </div>
    </form>
  );
}
