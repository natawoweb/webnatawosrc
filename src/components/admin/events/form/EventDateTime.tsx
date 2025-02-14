
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventDateTimeProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export function EventDateTime({
  date,
  time,
  onDateChange,
  onTimeChange,
}: EventDateTimeProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="event-date" className="flex items-center gap-1">
          Date<span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-date"
          name="event-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          autoComplete="off"
          required
          aria-required="true"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-time" className="flex items-center gap-1">
          Time<span className="text-red-500">*</span>
        </Label>
        <Input
          id="event-time"
          name="event-time"
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          autoComplete="off"
          required
          aria-required="true"
        />
      </div>
    </div>
  );
}
