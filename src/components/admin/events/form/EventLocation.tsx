
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
        <Label htmlFor="event-location" className="flex items-center gap-1">
          Location<span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-location"
          name="event-location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          autoComplete="street-address"
          required
          aria-required="true"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-max-participants" className="flex items-center gap-1">
          Maximum Participants<span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-max-participants"
          name="event-max-participants"
          type="number"
          min="1"
          value={maxParticipants}
          onChange={(e) => onMaxParticipantsChange(parseInt(e.target.value))}
          autoComplete="off"
          required
          aria-required="true"
        />
      </div>
    </div>
  );
}
