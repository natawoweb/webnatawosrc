
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSession();
  const { profile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery mode first
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      setIsResetPassword(true);
      return;
    }
  }, []);

  useEffect(() => {
    if (!session || loading) return;

    const redirectUser = async () => {
      try {
        if (profile) {
          // Always use replace: true to prevent back navigation
          if (profile.user_type === 'writer') {
            navigate('/dashboard', { replace: true });
          } else if (profile.user_type === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error("Redirect error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem processing your login. Please try again.",
        });
      }
    };

    redirectUser();
  }, [session, profile, loading, navigate, toast]);

  const handleAuthSuccess = () => {
    console.log("Auth success callback triggered");
  };

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
