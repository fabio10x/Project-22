import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center bg-[#ECF2F7] px-6 py-16 font-gilroy">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    </main>
  );
}
