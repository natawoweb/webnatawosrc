
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { EventManagement } from "@/components/admin/EventManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";
import { ContactSubmissions } from "@/components/admin/ContactSubmissions";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="contacts">Contact Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentManagement />
        </TabsContent>
        
        <TabsContent value="events">
          <EventManagement />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsManagement />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactSubmissions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
