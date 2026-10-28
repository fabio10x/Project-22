import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/react";

interface AuthButtonsProps {
  className?: string;
  onNavigate?: () => void;
}

/** Sign in / sign up when signed out, user menu when signed in. */
export default function AuthButtons({ className, onNavigate }: AuthButtonsProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className={className} />;
  }

  if (isSignedIn) {
    return (
      <div className={className} onClick={onNavigate}>
        <UserButton />
      </div>
    );
  }

  return (
    <div className={className} onClick={onNavigate}>
      <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
        <button
          type="button"
          className="text-[15px] text-white transition-opacity hover:opacity-70"
        >
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
        <button
          type="button"
          className="hidden text-[15px] text-white transition-opacity hover:opacity-70 sm:block"
        >
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
