
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
  onExistingAccount: () => void;
}

export function SignUpForm({ onSuccess, onExistingAccount }: SignUpFormProps) {
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
      const { data, error } = await supabase.auth.signUp({
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
        console.error('Signup error details:', error);
        
        // Check for user already exists error in multiple ways
        if (error.status === 422 || 
            error.message?.toLowerCase().includes('already') || 
            error.message?.toLowerCase().includes('registered') ||
            error.message?.toLowerCase().includes('exists')) {
          toast({
            variant: "destructive",
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            duration: 5000,
          });
          
          // Switch to sign in tab after a short delay
          setTimeout(() => {
            onExistingAccount();
          }, 100);
          
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to sign up. Please try again.",
          duration: 5000,
        });
        return;
      }

      if (!data.user) {
        throw new Error('Signup failed - no user returned');
      }

      // Only proceed with notifications if signup was successful
      await handleSignupNotifications(role, email, fullName);
      
      toast({
        title: "Success",
        description: role === 'writer' 
          ? "Your writer application has been submitted. Please check your email for confirmation."
          : "Welcome to NATAWO! Please check your email.",
        duration: 5000,
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        duration: 5000,
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
