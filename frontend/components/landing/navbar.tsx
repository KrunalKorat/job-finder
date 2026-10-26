"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Menu, X, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[#E6E8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#172B4D]">
              Job Finder
            </span>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#2563EB] -mt-1">
              AI Job Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#experience"
            className="text-sm font-medium text-[#263449] hover:text-[#2563EB] transition-colors"
          >
            Experience
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-[#263449] hover:text-[#2563EB] transition-colors"
          >
            Capabilities
          </Link>
          <Link
            href="#privacy-automation"
            className="text-sm font-medium text-[#263449] hover:text-[#2563EB] transition-colors"
          >
            Automation Guardrails
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-[#263449] hover:text-[#2563EB] transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="primary" size="md" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#263449] hover:bg-[#EEF4FF] focus-ring"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6E8ED] bg-[#F8F7F3] px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#263449] hover:text-[#2563EB] py-1"
            >
              Experience
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#263449] hover:text-[#2563EB] py-1"
            >
              Capabilities
            </Link>
            <Link
              href="#privacy-automation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#263449] hover:text-[#2563EB] py-1"
            >
              Automation Guardrails
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#263449] hover:text-[#2563EB] py-1"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-3 border-t border-[#E6E8ED] flex flex-col gap-2">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
