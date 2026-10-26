import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "Job Finder — AI-Assisted Job Discovery & Management",
  description:
    "Discover verified job opportunities from official company career pages and authorized APIs with server-side compliance guardrails.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F7F3] text-[#263449]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
