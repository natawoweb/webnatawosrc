/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useSession } from "@/hooks/useSession";
import { Toaster } from "@/components/ui/toaster";

export default function Auth() {
  const navigate = useNavigate();
  const { session, signOut } = useSession();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);

    const type = hashParams.get("type") || searchParams.get("type");

    if (type === "recovery") {
      setIsResetPassword(true);
      return;
    }

    // if (session && type !== "recovery") {
    //   navigate("/", { replace: true });
    // }
  }, [session, navigate]);

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
