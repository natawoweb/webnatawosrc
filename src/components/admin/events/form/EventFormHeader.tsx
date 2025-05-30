
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventFormHeaderProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function EventFormHeader({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: EventFormHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-title" className="flex items-center gap-1">
          Title<span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-title"
          name="event-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          autoComplete="off"
          required
          aria-required="true"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description" className="flex items-center gap-1">
          Description<span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="event-description"
          name="event-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          autoComplete="off"
          required
          aria-required="true"
        />
      </div>
    </div>
  );
}
