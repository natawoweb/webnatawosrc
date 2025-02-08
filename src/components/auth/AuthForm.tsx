
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSuccess: () => void;
}

export function AuthForm({ type, onSuccess }: AuthFormProps) {
  return type === 'signin' ? (
    <SignInForm onSuccess={onSuccess} />
  ) : (
    <SignUpForm onSuccess={onSuccess} />
  );
}
