
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogManagement } from "@/components/writer/BlogManagement";

export default function WriterDashboard() {
  return (
    <div className="container py-8">
      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs" className="space-y-4">
          <BlogManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
