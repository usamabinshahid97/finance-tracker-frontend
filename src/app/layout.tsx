// "use client";

import { AuthWrapper } from "@/components/auth/AuthWrapper";
// import { useEffect, useState } from "react";
// import SuperTokens from "supertokens-auth-react";
// import { initSuperTokens } from "@/config/supertokens";
// import { SessionAuth } from "supertokens-auth-react/recipe/session";
// import { usePathname } from "next/navigation";
import "@/styles/globals.css";

// Define paths that don't require authentication
// const unprotectedPaths = [
//   "/auth",
//   "/auth/signin",
//   "/auth/signup",
//   "/auth/reset-password",
// ];

// Initialize SuperTokens
// if (typeof window !== "undefined") {
//   SuperTokens.init(SuperTokensConfig.init());
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isClientLoaded, setIsClientLoaded] = useState(false);
  // const pathname = usePathname();

  // Set client-side rendering flag
  // useEffect(() => {
  //   // Initialize SuperTokens
  //   initSuperTokens();
  //   setIsClientLoaded(true);
  // }, []);

  // Check if current path requires authentication
  // const requiresAuth = !unprotectedPaths.some((path) =>
  //   pathname?.startsWith(path)
  // );

  // Only render on client-side to avoid hydration issues
  // if (!isClientLoaded) {
  //   return null;
  // }

  // Apply authentication wrapper if path requires auth
  return (
    <html lang="en">
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
