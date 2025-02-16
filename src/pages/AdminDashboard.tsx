
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { EventManagement } from "@/components/admin/EventManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";

export default function AdminDashboard() {
  return (
    <div className="container py-8">
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <EventManagement />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <SettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
