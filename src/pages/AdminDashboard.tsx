import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, BookText, Calendar, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch current user and check if they're an admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["checkAdminRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        required_role: 'admin'
      });
      
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      
      return data;
    },
  });

  useEffect(() => {
    if (!checkingAdmin && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, checkingAdmin, navigate, toast]);

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Management Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/users")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View, edit, and manage user permissions
            </p>
          </CardContent>
        </Card>

        {/* Content Management Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/content")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-5 w-5" />
              Content
            </CardTitle>
            <CardDescription>Manage blogs and writers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review and moderate content
            </p>
          </CardContent>
        </Card>

        {/* Events Management Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/events")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>Manage upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and manage events
            </p>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/settings")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure application settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}