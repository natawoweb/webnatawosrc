
import { useState } from "react";
import { Mail, Lock, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        throw error;
      }

      if (!user) {
        throw new Error('Signup failed');
      }

      // Send appropriate notifications
      if (role === 'reader') {
        // Send welcome email to reader
        await supabase.functions.invoke('signup-notifications', {
          body: {
            type: 'reader_welcome',
            email,
            fullName,
          }
        });
      } else if (role === 'writer') {
        // Get admin emails
        const { data: adminRoles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminRoles?.length) {
          const { data: adminProfiles } = await supabase
            .from('profiles')
            .select('email')
            .in('id', adminRoles.map(r => r.user_id));

          const adminEmails = adminProfiles?.map(p => p.email).filter(Boolean) || [];

          // Notify admins
          await supabase.functions.invoke('signup-notifications', {
            body: {
              type: 'writer_request',
              email,
              fullName,
              adminEmails,
            }
          });

          // Send confirmation to writer
          await supabase.functions.invoke('signup-notifications', {
            body: {
              type: 'request_submitted',
              email,
              fullName,
            }
          });
        }
      }
      
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
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

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
        <>
          <div className="space-y-2">
            <Label htmlFor="pseudonym">Pseudonym</Label>
            <Input
              id="pseudonym"
              type="text"
              placeholder="Enter your pen name"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
