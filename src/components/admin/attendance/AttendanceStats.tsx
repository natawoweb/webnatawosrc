import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface AttendanceStatsProps {
  events: Event[];
}

export function AttendanceStats({ events }: AttendanceStatsProps) {
  const { data: stats } = useQuery({
    queryKey: ["attendance-stats"],
    queryFn: async () => {
      const promises = events.map(async (event) => {
        const { data: registrations } = await supabase
          .from("event_registrations")
          .select("*")
          .eq("event_id", event.id);

        const { data: attendance } = await supabase
          .from("event_attendance")
          .select("*")
          .eq("event_id", event.id);

        return {
          event,
          registrations: registrations?.length || 0,
          attendance: attendance?.length || 0,
        };
      });

      return Promise.all(promises);
    },
  });

  const totalRegistrations = stats?.reduce((acc, curr) => acc + curr.registrations, 0) || 0;
  const totalAttendance = stats?.reduce((acc, curr) => acc + curr.attendance, 0) || 0;
  const averageAttendanceRate = totalRegistrations
    ? Math.round((totalAttendance / totalRegistrations) * 100)
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRegistrations}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttendance}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Attendance Rate</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageAttendanceRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}