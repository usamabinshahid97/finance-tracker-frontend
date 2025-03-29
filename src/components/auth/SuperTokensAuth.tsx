// src/components/auth/SuperTokensAuth.tsx
"use client";

import { useEffect } from "react";
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { initSuperTokens } from "@/config/supertokens";

export default function SuperTokensAuth() {
  useEffect(() => {
    initSuperTokens();
  }, []);

  // Return a div that will be replaced by SuperTokens
  return <div id="supertokens-root" />;
}
