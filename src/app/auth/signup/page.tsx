"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "supertokens-auth-react/recipe/emailpassword";
import { doesEmailExist } from "supertokens-web-js/recipe/emailpassword";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Debounced email check
  useEffect(() => {
    if (!email || email.length < 5 || !email.includes("@")) return;

    const timeoutId = setTimeout(() => {
      validateEmailUniqueness(email);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  async function validateEmailUniqueness(email: string) {
    if (!email) return;

    setIsCheckingEmail(true);
    try {
      const response = await doesEmailExist({ email });

      if (response.doesExist) {
        setEmailError(
          "This email is already registered. Please sign in instead."
        );
      } else {
        setEmailError("");
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "isSuperTokensGeneralError" in err &&
        err.isSuperTokensGeneralError === true &&
        "message" in err
      ) {
        setEmailError(err.message as string);
      } else {
        setEmailError("Unable to verify email availability. Please try again.");
        console.error("Email validation error:", err);
      }
    } finally {
      setIsCheckingEmail(false);
    }
  }

  function validatePassword(password: string) {
    // Minimum 8 characters, at least one letter and one number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  }

  async function handleSignUp(e: { preventDefault: () => void }) {
    e.preventDefault();

    // Don't proceed if the email already exists
    if (emailError) {
      return;
    }

    setIsLoading(true);
    setError("");

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters and include both letters and numbers."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await signUp({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "OK") {
        // Successful sign-up
        router.push("/dashboard");
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        // the reason string is a user friendly message
        // about what went wrong. It can also contain a support code which users
        // can tell you so you know why their sign up was not allowed.
        window.alert(response.reason);
      } else {
        // Handle specific error cases
        if (response.status === "FIELD_ERROR") {
          // Field validation errors
          const errorList = response.formFields
            .map((field) => `${field.id}: ${field.error}`)
            .join(", ");
          setError(`Please correct the following: ${errorList}`);
        } else {
          setError("An error occurred during registration. Please try again.");
        }
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "isSuperTokensGeneralError" in err &&
        err.isSuperTokensGeneralError === true
      ) {
        // this may be a custom error message sent from the API by you.
        if ("message" in err && typeof err.message === "string") {
          window.alert(err.message);
        }
      } else {
        window.alert("Oops! Something went wrong.");
      }
      //   setError("An unexpected error occurred. Please try again.");
      //   console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-gray-600">
            Sign up to start tracking your finances
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmailUniqueness(email)}
              className={`mt-1 block w-full px-3 py-2 border ${
                emailError ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {/* Added loading spinner */}
            {isCheckingEmail && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </div>
          {/* Added error message display */}
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isCheckingEmail || !!emailError}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading || isCheckingEmail || !!emailError
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
