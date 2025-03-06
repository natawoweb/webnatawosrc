
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { session } = useSession();
  const { profile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { toast } = useToast();

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

    // Handle redirect based on session and profile
    const handleRedirect = async () => {
      try {
        if (session && !loading && profile) {
          console.log("Session and profile loaded, checking roles...");
          
          const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
            user_id: session.user.id,
            required_role: 'admin'
          });

          if (roleError) {
            console.error("Error checking admin role:", roleError);
            return;
          }

          if (isAdmin) {
            console.log("Admin user detected, redirecting to admin dashboard");
            navigate("/admin");
            return;
          }

          if (profile.user_type === 'writer') {
            console.log("Writer detected, redirecting to dashboard");
            navigate("/dashboard");
            return;
          }

          // Default navigation for other users
          console.log("Regular user detected, redirecting to home");
          navigate("/");
        }
      } catch (error) {
        console.error("Error in redirect handling:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem processing your login. Please try again.",
        });
      }
    };

    handleRedirect();
  }, [session, profile, loading, navigate, toast]);

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isResetPassword) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>Please enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  const handleAuthSuccess = () => {
    console.log("Auth success callback triggered");
    // Success handling is now managed in the useEffect hook
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to NATAWO</CardTitle>
          <CardDescription>Join our community of Tamil writers and readers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: 'signin' | 'signup') => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthForm type="signin" onSuccess={handleAuthSuccess} />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthForm type="signup" onSuccess={handleAuthSuccess} onExistingAccount={() => setActiveTab('signin')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
