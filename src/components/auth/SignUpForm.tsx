import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BaseFormFields } from './form-fields/BaseFormFields';
import { WriterFormFields } from './form-fields/WriterFormFields';
import { handleSignupNotifications } from './utils/signupNotifications';

interface SignUpFormProps {
  onExistingAccount: () => void;
}

export function SignUpForm({ onExistingAccount }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'reader' | 'writer'>('reader');
  const [pseudonym, setPseudonym] = useState('');
  const [bio, setBio] = useState('');
  const [county, setCounty] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        variant: 'default',
        title: '⚠ Warning',
        description:
          "You must accept the NATAWO Bylaws and the website's legal terms, including the Privacy Policy, Terms of Use, and Guidelines, to proceed. Please check the required box to continue.",
        duration: 5000,
        className: 'bg-yellow-300 text-black',
      });
      return;
    }

    if (!county) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select your country',
      });
      return;
    }

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
            county: county,
            state: state,
          },
        },
      });

      if (error) {
        console.error('Signup error details:', error);

        if (
          error.status === 422 ||
          error.message?.toLowerCase().includes('already') ||
          error.message?.toLowerCase().includes('registered') ||
          error.message?.toLowerCase().includes('exists')
        ) {
          toast({
            variant: 'destructive',
            title: 'Account Already Exists',
            description:
              'An account with this email already exists. Please sign in instead.',
            duration: 5000,
          });

          onExistingAccount();
          return;
        }

        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to sign up. Please try again.',
          duration: 5000,
        });
        return;
      }

      if (!data.user) {
        throw new Error('Signup failed - no user returned');
      }

      await handleSignupNotifications(role, email, fullName);

      toast({
        title: 'Success',
        description:
          role === 'writer'
            ? 'Your writer application has been submitted. Please check your email for confirmation.'
            : 'Welcome to NATAWO! Please check your email.',
        duration: 5000,
      });

      // Clear the form
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('reader');
      setPseudonym('');
      setBio('');
      setCounty('');
      setState('');

      // Switch to sign in tab
      onExistingAccount();
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to sign up. Please try again.',
          duration: 5000,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to sign up. Please try again.',
          duration: 5000,
        });
      }
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
        county={county}
        setCounty={setCounty}
        setState={setState}
        state={state}
      />

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          defaultValue="reader"
          onValueChange={(value: 'reader' | 'writer') => setRole(value)}
        >
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

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="w-4 h-4 mt-1 border-gray-300 rounded focus:ring focus:ring-blue-500"
        />
        <Label htmlFor="terms" className="text-sm text-gray-700">
          You must accept <span className="font-medium">NATAWO Bylaws</span> and
          website legal terms such as{' '}
          <span className="font-medium">
            NATAWO Privacy Policies, Terms of Use, and Guidelines
          </span>{' '}
          in order to create login credentials and leverage our systems.
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
}
