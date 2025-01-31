import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AttendanceList } from "./AttendanceList";
import { AttendanceStats } from "./AttendanceStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Database } from "@/integrations/supabase/types";

type Event = Database['public']['Tables']['events']['Row'];

export function AttendanceManagement() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Management</h2>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Attendance List</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {/* Temporarily comment out AttendanceList until its types are fixed */}
          {/* <AttendanceList events={events || []} /> */}
          <div>Attendance List temporarily disabled</div>
        </TabsContent>

        <TabsContent value="stats">
          <AttendanceStats events={events || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}