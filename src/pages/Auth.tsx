import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      // ✅ Check for recovery type and tokens
      if (type === "recovery" && accessToken && refreshToken) {
        // ⚠️ Set a localStorage flag so we know we're in reset mode
        localStorage.setItem("isResetPassword", "true");

        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        // ✅ Clean URL
        window.history.replaceState({}, document.title, "/auth");
        setIsResetPassword(true);
        setLoading(false);
        return;
      }

      // ✅ Check if flag exists even if user is now logged in
      if (localStorage.getItem("isResetPassword") === "true") {
        setIsResetPassword(true);
        setLoading(false);
        return;
      }

      // ✅ Now check for logged in session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/", { replace: true });
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [navigate, location]);

  if (loading) return <Toaster />;

  if (isResetPassword) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Please enter your new password below.
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
