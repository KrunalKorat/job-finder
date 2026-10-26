"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your account email address.");
      return;
    }

    setIsLoading(true);
    try {
      await api.forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process request. Please try again.");
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
          Reset your password
        </h1>
        <p className="text-sm text-[#697586] mt-1">
          We&apos;ll send instructions to recover access to your profile
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Password Recovery</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll dispatch a password reset token
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-[#15803D]">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">Instructions Dispatched</p>
                    <p className="text-xs text-[#166534] mt-1">
                      If an account exists for {email}, a secure password reset link has been dispatched. Check your inbox or terminal logs in development mode.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/auth/reset-password">
                    <Button variant="outline" size="md" className="w-full">
                      Enter Reset Token Directly
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
                  label="Email Address"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-[#697586] pt-4 border-t border-[#E6E8ED]">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
