
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BaseFormFields } from "./form-fields/BaseFormFields";
import { WriterFormFields } from "./form-fields/WriterFormFields";
import { handleSignupNotifications } from "./utils/signupNotifications";

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<'reader' | 'writer'>('reader');
  const [pseudonym, setPseudonym] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            pseudonym: pseudonym,
            bio: bio,
          }
        }
      });

      if (error) {
        // Handle the "User already registered" error specifically
        if (error.message === "User already registered") {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: "An account with this email already exists. Please sign in instead.",
          });
          return;
        }
        throw error;
      }

      if (!user) {
        throw new Error('Signup failed');
      }

      // Only proceed with notifications if signup was successful
      await handleSignupNotifications(role, email, fullName);
      
      toast({
        title: "Success",
        description: role === 'writer' 
          ? "Your writer application has been submitted. Please check your email for confirmation."
          : "Welcome to NATAWO! Please check your email.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BaseFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
      />

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select defaultValue="reader" onValueChange={(value: 'reader' | 'writer') => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reader">Reader</SelectItem>
            <SelectItem value="writer">Writer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {role === 'writer' && (
        <WriterFormFields
          pseudonym={pseudonym}
          setPseudonym={setPseudonym}
          bio={bio}
          setBio={setBio}
        />
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
