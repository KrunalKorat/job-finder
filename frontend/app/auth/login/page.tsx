"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172B4D]">
            Job Finder
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#697586] mt-1">
          Sign in to access your dashboard and matched opportunities
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your account credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[#DC2626] text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-[#697586] pt-4 border-t border-[#E6E8ED]">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/auth/register"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-bold"
              >
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
