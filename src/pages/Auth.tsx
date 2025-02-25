
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useProfile } from "@/hooks/useProfile";
import { Toaster } from "@/components/ui/toaster";

export default function Auth() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    // Always check for recovery mode first
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      console.log('Recovery mode detected');
      setIsResetPassword(true);
      return; // Exit early to prevent any other auth checks
    }

    // Only proceed with session check if not in recovery mode and not loading
    if (!isResetPassword && !loading) {
      // Check if user is already logged in
      const checkSessionAndRedirect = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session found, checking roles...");
          try {
            // Check if user is admin
            const { data: isAdmin } = await supabase.rpc('has_role', {
              user_id: session.user.id,
              required_role: 'admin'
            });
            
            console.log("Admin check result:", isAdmin);
            
            if (isAdmin) {
              console.log("Admin user detected, redirecting to admin dashboard");
              navigate("/admin");
              return;
            }

            // Check if user is a writer
            if (profile?.user_type === 'writer') {
              console.log("Writer detected, redirecting to dashboard");
              navigate("/dashboard");
              return;
            }

            // Default navigation for other users
            console.log("Regular user detected, redirecting to home");
            navigate("/");
          } catch (error) {
            console.error("Error checking user role:", error);
          }
        }
      };

      checkSessionAndRedirect();

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && !loading) { // Only proceed if not loading
          console.log("Auth state changed, checking roles...");
          try {
            // Check if user is admin
            const { data: isAdmin } = await supabase.rpc('has_role', {
              user_id: session.user.id,
              required_role: 'admin'
            });
            
            console.log("Auth state change - Admin check result:", isAdmin);
            
            if (isAdmin) {
              console.log("Admin user detected, redirecting to admin dashboard");
              navigate("/admin");
              return;
            }

            // Check if user is a writer
            if (profile?.user_type === 'writer') {
              console.log("Writer detected, redirecting to dashboard");
              navigate("/dashboard");
              return;
            }

            // Default navigation for other users
            console.log("Regular user detected, redirecting to home");
            navigate("/");
          } catch (error) {
            console.error("Error checking user role:", error);
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [navigate, profile, isResetPassword, loading]); // Added loading back to dependency array

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isResetPassword) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Please enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to NATAWO</CardTitle>
          <CardDescription>
            Join our community of Tamil writers and readers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: 'signin' | 'signup') => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthForm type="signin" onSuccess={() => {}} />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthForm type="signup" onSuccess={() => {}} onExistingAccount={() => setActiveTab('signin')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
