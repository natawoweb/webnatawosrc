
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventManagement } from "@/components/admin/EventManagement";

export default function Dashboard() {
  return (
    <div className="container py-8">
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4">
          <EventManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
