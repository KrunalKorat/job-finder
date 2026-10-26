"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password, name.trim() || undefined);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
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
          Create your account
        </h1>
        <p className="text-sm text-[#697586] mt-1">
          Join the platform built for authorized, spam-free career discovery
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Set up your profile to match with verified job listings
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
                label="Full Name (Optional)"
                type="text"
                autoComplete="name"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                helperText="Must be at least 8 characters with a mix of letters and numbers"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs text-[#15803D]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero scraping. Automated submissions remain strictly disabled by default.</span>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-[#697586] pt-4 border-t border-[#E6E8ED]">
              Already registered?{" "}
              <Link
                href="/auth/login"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-bold"
              >
                Sign in to your account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
