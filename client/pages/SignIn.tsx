import { SignIn } from "@clerk/react";
import { useSearchParams } from "react-router-dom";

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? undefined;

  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center bg-[#ECF2F7] px-6 py-16 font-gilroy">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={redirectUrl}
        fallbackRedirectUrl="/dashboard"
      />
    </main>
  );
}
