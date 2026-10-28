import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import InnerPage from "./pages/InnerPage";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import CheckoutPage from "./pages/Checkout";
import RequireAuth from "./components/RequireAuth";
import SupabaseAuthSync from "./components/SupabaseAuthSync";

const innerPageSlugs = [
  "features",
  "pricing",
  "services",
  "demos",
  "support",
  "contact",
  "about",
  "careers",
  "press",
  "news",
  "help",
  "privacy",
  "terms",
  "returns",
];

const queryClient = new QueryClient();

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

const App = () => (
  <ClerkProvider publishableKey={clerkPublishableKey ?? ""} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <SupabaseAuthSync />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {innerPageSlugs.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<InnerPage />} />
            ))}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
