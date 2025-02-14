
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

export interface UseEventFormProps {
  initialData?: Partial<EventFormData>;
  onSuccess?: () => void;
}
