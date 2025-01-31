import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Temporarily commented out while fixing type issues
/*
interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string;
  check_in_time: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}
*/

export function AttendanceList() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  // Temporarily commented out while fixing type issues
  /*
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const { data: attendance } = useQuery({
    queryKey: ["attendance", selectedEvent],
    enabled: !!selectedEvent,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_attendance")
        .select(`
          *,
          profiles (*)
        `)
        .eq("event_id", selectedEvent);

      if (error) throw error;
      return data as unknown as EventAttendance[];
    },
  });

  const { data: registrations } = useQuery({
    queryKey: ["registrations", selectedEvent],
    enabled: !!selectedEvent,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          profiles (*)
        `)
        .eq("event_id", selectedEvent);

      if (error) throw error;
      return data as unknown as EventRegistration[];
    },
  });
  */

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select event" />
          </SelectTrigger>
          <SelectContent>
            {/* Temporarily commented out while fixing type issues */}
            {/*events?.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))*/}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance</h3>
              <div className="space-y-4">
                {/* Temporarily commented out while fixing type issues */}
                {/*attendance?.map((record) => (
                  <div key={record.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.profiles.avatar_url || undefined} />
                      <AvatarFallback>
                        {record.profiles.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.profiles.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.profiles.email}
                      </p>
                    </div>
                  </div>
                ))*/}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Registrations</h3>
              <div className="space-y-4">
                {/* Temporarily commented out while fixing type issues */}
                {/*registrations?.map((record) => (
                  <div key={record.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.profiles.avatar_url || undefined} />
                      <AvatarFallback>
                        {record.profiles.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{record.profiles.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.profiles.email}
                      </p>
                    </div>
                  </div>
                ))*/}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}