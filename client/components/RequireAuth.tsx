import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import type { ReactNode } from "react";

/** Sends signed-out visitors to the sign-in page. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#ECF2F7] font-gilroy text-navy/60">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
