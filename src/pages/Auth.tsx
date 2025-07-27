import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      // ✅ If this is a password reset flow
      if (type === "recovery" && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("❌ Error setting session:", error.message);
          toast({
            title: "Link expired or invalid",
            description: "This reset link has already been used or is invalid. Please request a new one.",
            variant: "destructive",
          });
          navigate("/auth", { replace: true });
          setLoading(false);
          return;
        }

        // ✅ Flag reset flow, clean up URL
        setIsResetPassword(true);
        window.history.replaceState({}, document.title, "/auth?type=reset");
        setLoading(false);
        return;
      }

      // ✅ Regular login check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // ❌ Redirect only if NOT in reset mode
      const isResetRoute = new URLSearchParams(location.search).get("type") === "reset";

      if (session && !isResetRoute) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [navigate, location]);

  if (loading) return <Toaster />; // Allow toaster to show even on load

  if (isResetPassword) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>Please enter your new password below.</CardDescription>
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
            Join our community of Thamizh writers and readers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value: "signin" | "signup") => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <AuthForm type="signin" onSuccess={() => {}} />
            </TabsContent>

            <TabsContent value="signup">
              <AuthForm
                type="signup"
                onSuccess={() => {}}
                onExistingAccount={() => setActiveTab("signin")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
