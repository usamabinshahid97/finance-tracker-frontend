"use client";

// import SuperTokens from "supertokens-auth-react";
// import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { useEffect } from "react";

export default function Auth() {
  // Redirect to the auth page if accessed directly
  useEffect(() => {
    if (window.location.pathname === "/auth") {
      window.location.href = "/auth/signin";
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Personal Finance Tracker
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your financial dashboard
          </p>
        </div>

        <div className="mt-8">
          {/* The SuperTokens prebuilt UI will be rendered here automatically */}
        </div>
      </div>
    </div>
  );
}
