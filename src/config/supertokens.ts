import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

// Create a safe initialization tracker
let initialized = false;

export const appInfo = {
  appName: "Personal Finance Tracker",
  apiDomain: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000",
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};

export const initSuperTokens = () => {
  if (!initialized && typeof window !== "undefined") {
    try {
      SuperTokens.init({
        appInfo,
        recipeList: [EmailPassword.init(), Session.init()],
      });
      initialized = true;
    } catch (err) {
      console.error("SuperTokens initialization error:", err);
    }
  }
};
