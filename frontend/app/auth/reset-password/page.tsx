"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage("Please enter or paste your reset token.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword(token.trim(), newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>
          Enter the secure reset token received and pick a new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-[#15803D]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Password Reset Successfully</p>
                <p className="text-xs text-[#166534] mt-1">
                  Your new credentials are now active. You can now sign in to your Job Finder account.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/auth/login">
                <Button variant="primary" size="md" className="w-full">
                  Sign In Now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[#DC2626] text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Reset Token"
              type="text"
              required
              placeholder="Paste the reset token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#697586] pt-4 border-t border-[#E6E8ED]">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-bold"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
          Choose a new password
        </h1>
        <p className="text-sm text-[#697586] mt-1">
          Must be at least 8 characters long
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={<div className="p-8 text-center text-sm text-[#697586]">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
