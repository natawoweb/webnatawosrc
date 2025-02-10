
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventLocationProps {
  location: string;
  maxParticipants: number;
  onLocationChange: (value: string) => void;
  onMaxParticipantsChange: (value: number) => void;
}

export function EventLocation({
  location,
  maxParticipants,
  onLocationChange,
  onMaxParticipantsChange,
}: EventLocationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-1">
          Location<span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_participants" className="flex items-center gap-1">
          Maximum Participants<span className="text-red-500">*</span>
        </Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={maxParticipants}
          onChange={(e) => onMaxParticipantsChange(parseInt(e.target.value))}
          required
        />
      </div>
    </div>
  );
}
