// src/config/supertokens.ts
import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

// Track initialization to prevent multiple init calls
let initialized = false;

export const appInfo = {
  appName: "Personal Finance Tracker",
  apiDomain: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};

export function initSuperTokens() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  try {
    SuperTokens.init({
      appInfo,
      recipeList: [
        Session.init(),
        EmailPassword.init({
          override: {
            functions: (originalImplementation) => ({
              ...originalImplementation,
              redirectToAuth: () => {
                window.location.href = "/auth/signin";
              },
            }),
          },
        }),
      ],
    });

    console.log("SuperTokens initialized successfully");
    initialized = true;
  } catch (err) {
    console.error("SuperTokens initialization error:", err);
  }
}
