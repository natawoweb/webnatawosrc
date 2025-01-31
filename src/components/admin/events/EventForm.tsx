import { EventFormHeader } from "./form/EventFormHeader";
import { EventDateTime } from "./form/EventDateTime";
import { EventLocation } from "./form/EventLocation";
import { EventGallery } from "./form/EventGallery";
import { EventCategories } from "./form/EventCategories";
import { useEventForm, EventFormData } from "./hooks/useEventForm";
import { uploadImages } from "./hooks/useImageUpload";

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSuccess?: () => void;
}

export function EventForm({ initialData, onSuccess }: EventFormProps) {
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

    try {
      const uploadedUrls = await uploadImages(selectedImages);
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