import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AttendanceListProps {
  events: Event[];
}

export function AttendanceList({ events }: AttendanceListProps) {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: attendanceData, refetch: refetchAttendance } = useQuery({
    queryKey: ["event-attendance", selectedEvent],
    enabled: !!selectedEvent,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_attendance")
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq("event_id", selectedEvent);

      if (error) throw error;
      return data;
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["event-registrations", selectedEvent],
    enabled: !!selectedEvent,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq("event_id", selectedEvent);

      if (error) throw error;
      return data?.map(registration => ({
        ...registration,
        profile: registration.profiles || {
          full_name: "Unknown",
          avatar_url: null,
          bio: "",
          created_at: "",
          email: "",
          id: registration.user_id,
          updated_at: "",
        }
      }));
    },
  });

  const handleCheckIn = async (userId: string) => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from("event_attendance")
        .insert([
          {
            event_id: selectedEvent,
            user_id: userId,
            status: "checked_in",
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });

      refetchAttendance();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record attendance",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Select
        value={selectedEvent || ""}
        onValueChange={(value) => setSelectedEvent(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.title} - {format(new Date(event.date), "MMM d, yyyy")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedEvent && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations?.map((registration) => {
              const attendance = attendanceData?.find(
                (a) => a.user_id === registration.user_id
              );

              return (
                <TableRow key={registration.id}>
                  <TableCell>{registration.profile.full_name}</TableCell>
                  <TableCell>
                    {attendance ? (
                      <Badge className="bg-green-500">
                        <Check className="w-4 h-4 mr-1" />
                        Checked In
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="w-4 h-4 mr-1" />
                        Not Checked In
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {attendance?.check_in_time
                      ? format(new Date(attendance.check_in_time), "MMM d, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {!attendance && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckIn(registration.user_id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Check In
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}