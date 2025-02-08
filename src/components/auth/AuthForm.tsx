
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSuccess: () => void;
  onExistingAccount?: () => void;
}

export function AuthForm({ type, onSuccess, onExistingAccount }: AuthFormProps) {
  return type === 'signin' ? (
    <SignInForm onSuccess={onSuccess} />
  ) : (
    <SignUpForm onSuccess={onSuccess} onExistingAccount={onExistingAccount || (() => {})} />
  );
}
