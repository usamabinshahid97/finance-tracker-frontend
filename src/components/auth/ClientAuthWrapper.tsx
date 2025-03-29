"use client";

import { useEffect, useState } from "react";
import { initSuperTokens } from "@/config/supertokens";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { usePathname } from "next/navigation";

// Define paths that don't require authentication
const unprotectedPaths = [
  "/auth",
  "/auth/signin",
  "/auth/signup",
  "/auth/reset-password",
];

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const pathname = usePathname();

  // Initialize SuperTokens on the client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize SuperTokens
      initSuperTokens();
      setIsClientLoaded(true);
    }
  }, []);

  // Check if current path requires authentication
  const requiresAuth = pathname
    ? !unprotectedPaths.some((path) => pathname.startsWith(path))
    : false;

  // Handle loading state during client-side initialization
  if (!isClientLoaded) {
    // Return a simple loading indicator that matches what the server would render
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Return authenticated or non-authenticated content
  return requiresAuth ? <SessionAuth>{children}</SessionAuth> : children;
}
