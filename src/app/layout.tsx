// src/app/layout.tsx
import "@/styles/globals.css";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
