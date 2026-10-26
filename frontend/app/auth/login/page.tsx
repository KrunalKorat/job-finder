"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(cleanEmail, password);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 mb-4 group focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] rounded-xl px-2 py-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172B4D]">
            Job Finder
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">
          Sign In
        </h1>
        <p className="text-sm text-[#697586] mt-1.5 max-w-sm mx-auto">
          Personal AI-powered job discovery and application management
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="bg-white border-[#E6E8ED] shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#172B4D]">Account Access</CardTitle>
            <CardDescription className="text-xs text-[#697586]">
              Enter your credentials to access your personal dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[#DC2626] text-sm animate-fade-in"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#697586]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="user@jobfinder.io"
                    value={email}

                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E6E8ED] bg-white text-sm text-[#172B4D] placeholder-[#697586]/60 transition-colors focus:border-[#2563EB] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 disabled:bg-gray-50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors focus:outline-hidden focus:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#697586]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E6E8ED] bg-white text-sm text-[#172B4D] placeholder-[#697586]/60 transition-colors focus:border-[#2563EB] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 disabled:bg-gray-50"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#697586] hover:text-[#172B4D] transition-colors focus:outline-hidden"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl font-medium shadow-xs transition-colors flex items-center justify-center gap-2"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  <span>Sign In</span>
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
