"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyToken = async (tokenToVerify: string) => {
    setStatus("verifying");
    setErrorMessage(null);
    try {
      await api.verifyEmail(tokenToVerify);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Invalid or expired email verification token.");
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      verifyToken(urlToken);
    }
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Confirming your email address for account security
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "verifying" && (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
            <p className="text-sm text-[#697586]">Verifying token with server...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-[#15803D]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Email Verified Successfully</p>
                <p className="text-xs text-[#166534] mt-1">
                  Your email address has been verified. You have full access to Job Finder features.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard">
                <Button variant="primary" size="md" className="w-full">
                  Proceed to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-[#DC2626]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Verification Failed</p>
                <p className="text-xs text-[#991B1B] mt-1">{errorMessage}</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/auth/login">
                <Button variant="outline" size="md" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "idle" && !token && (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm text-[#697586]">
              Please provide a valid verification link with token parameter.
            </p>
            <Link href="/auth/login">
              <Button variant="outline" size="md">
                Go to Sign In
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
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
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={<div className="p-8 text-center text-sm text-[#697586]">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
