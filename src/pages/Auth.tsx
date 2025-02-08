
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { useProfile } from "@/hooks/useProfile";
import { Toaster } from "@/components/ui/toaster";

export default function Auth() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });
        
        if (isAdmin) {
          navigate("/admin");
        } else if (profile?.user_type === 'writer') {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });
        
        if (isAdmin) {
          navigate("/admin");
        } else if (profile?.user_type === 'writer') {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, profile]);

  const handleExistingAccount = () => {
    setActiveTab('signin');
  };

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
              <AuthForm type="signup" onSuccess={() => {}} onExistingAccount={handleExistingAccount} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

