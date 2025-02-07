
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resetUserPassword } from "@/utils/adminUtils";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordButtonProps {
  email: string;
}

export function ResetPasswordButton({ email }: ResetPasswordButtonProps) {
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetUserPassword(email);
      
      if (result.success && result.credentials) {
        toast({
          title: "Password Reset Successful",
          description: `New Password: ${result.credentials.password}\nPlease save this password securely.`,
          duration: 10000, // Show for 10 seconds
        });
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: result.error || "Failed to reset password",
        });
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleReset}
      disabled={isResetting}
    >
      {isResetting ? "Resetting..." : "Reset Password"}
    </Button>
  );
}
