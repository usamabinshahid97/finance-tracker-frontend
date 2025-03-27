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

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const pathname = usePathname();

  // Set client-side rendering flag
  useEffect(() => {
    // Initialize SuperTokens
    initSuperTokens();
    setIsClientLoaded(true);
  }, []);

  // Check if current path requires authentication
  const requiresAuth = !unprotectedPaths.some((path) =>
    pathname?.startsWith(path)
  );

  // Only render on client-side to avoid hydration issues
  if (!isClientLoaded) {
    return null;
  }

  // Return authenticated or non-authenticated content
  return requiresAuth ? <SessionAuth>{children}</SessionAuth> : children;
}
