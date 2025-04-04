"use client";

import { useEffect, useState } from "react";
import { initSuperTokens } from "@/config/supertokens";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { usePathname } from "next/navigation";

// Paths that don't require authentication
const unprotectedPaths = [
  "/auth",
  "/auth/signin",
  "/auth/signup",
  "/auth/reset-password",
];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize SuperTokens
      initSuperTokens();
      setIsInitialized(true);
    }
  }, []);

  // Show a minimal loading state during initialization
  if (!isInitialized) {
    return null;
  }

  // Check if current path requires authentication
  const requiresAuth = pathname
    ? !unprotectedPaths.some((path) => pathname.startsWith(path))
    : false;

  // Return appropriate content based on authentication requirements
  return requiresAuth ? <SessionAuth>{children}</SessionAuth> : children;
}
