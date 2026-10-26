"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function DashboardOverviewPage({ onOpenMobileMenu }: PageProps) {
  const { user } = useAuth();

  const preferences = user?.career_preference;
  const profile = user?.profile;
  const automation = user?.automation_setting;

  const hasPreferences =
    preferences &&
    (preferences.desired_job_titles?.length > 0 ||
      preferences.skills?.length > 0);

  return (
    <>
      <DashboardHeader
        title="Overview"
        subtitle="Candidate profile, active guardrails, and discovery readiness"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Real User Greeting Banner */}
        <div className="bg-white rounded-2xl border border-[#E6E8ED] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Welcome
              </span>
              {user?.is_verified ? (
                <Badge variant="success">Verified Account</Badge>
              ) : (
                <Badge variant="warning">Verification Pending</Badge>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">
              Hello, {profile?.name || user?.email.split("@")[0]}
            </h2>
            <p className="text-sm text-[#697586] max-w-xl">
              Job Finder is connected to your candidate account. Below is your genuine onboarding progress and active safety settings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard/profile">
              <Button variant="primary" size="md">
                Manage Preferences
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Real Onboarding Steps */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#172B4D]">
            Onboarding Checklist
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Resume Upload State */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <Badge variant="neutral">Phase 2 Module</Badge>
                </div>
                <CardTitle className="text-base">Resume Document</CardTitle>
                <CardDescription>
                  Resume parsing and PDF extraction will be activated in Phase 2.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED] flex items-start gap-2.5 text-xs text-[#697586]">
                  <FileUp className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>
                    No resume uploaded yet. Your manual career preferences will be used for matching in the interim.
                  </span>
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Configure Manual Skills
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 2: Career Preferences */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  {hasPreferences ? (
                    <Badge variant="success">Configured</Badge>
                  ) : (
                    <Badge variant="warning">Setup Required</Badge>
                  )}
                </div>
                <CardTitle className="text-base">Career Preferences</CardTitle>
                <CardDescription>
                  Target titles, minimum compensation, and location preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-[#697586] space-y-1.5 p-3 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED]">
                  <p>
                    <strong className="text-[#172B4D]">Titles:</strong>{" "}
                    {preferences?.desired_job_titles?.length
                      ? preferences.desired_job_titles.join(", ")
                      : "None set yet"}
                  </p>
                  <p>
                    <strong className="text-[#172B4D]">Arrangement:</strong>{" "}
                    {preferences?.work_arrangements?.length
                      ? preferences.work_arrangements.join(", ")
                      : "All"}
                  </p>
                  <p>
                    <strong className="text-[#172B4D]">Min Salary:</strong>{" "}
                    {preferences?.min_salary
                      ? `$${preferences.min_salary.toLocaleString()} ${preferences.salary_currency}`
                      : "No floor specified"}
                  </p>
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Career Preferences
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 3: Automation Safeguards */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <Badge variant={automation?.automation_enabled ? "warning" : "success"}>
                    {automation?.automation_enabled ? "Active Limits" : "Disabled (Default)"}
                  </Badge>
                </div>
                <CardTitle className="text-base">Automation Policy</CardTitle>
                <CardDescription>
                  Server-side submission limits and approval requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-[#697586] space-y-1.5 p-3 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED]">
                  <p>
                    <strong className="text-[#172B4D]">Status:</strong>{" "}
                    {automation?.automation_enabled ? "Enabled" : "Disabled (Safe Default)"}
                  </p>
                  <p>
                    <strong className="text-[#172B4D]">Approval:</strong>{" "}
                    {automation?.require_approval ? "Required for every job" : "Auto"}
                  </p>
                  <p>
                    <strong className="text-[#172B4D]">Caps:</strong> Max{" "}
                    {automation?.max_applications_per_day || 5}/day,{" "}
                    {automation?.max_applications_per_week || 20}/week
                  </p>
                </div>
                <Link href="/dashboard/automation">
                  <Button variant="outline" size="sm" className="w-full">
                    Configure Automation Center
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Real Source Providers Status */}
        <div className="bg-white rounded-2xl border border-[#E6E8ED] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#172B4D]">
                Authorized Job Source Registry
              </h3>
              <p className="text-xs text-[#697586] mt-0.5">
                Official integrations declaring verified capabilities without scraping
              </p>
            </div>
            <Badge variant="primary">3 Sources Registered</Badge>
          </div>

          <div className="divide-y divide-[#E6E8ED]">
            <div className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#172B4D]">Greenhouse Job Board API</p>
                <p className="text-xs text-[#697586]">
                  Public ATS board feed • Job discovery permitted • Programmatic submissions restricted
                </p>
              </div>
              <Badge variant="success">Read Authorized</Badge>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#172B4D]">Lever Postings API</p>
                <p className="text-xs text-[#697586]">
                  Public postings JSON • Job discovery permitted • Direct submissions restricted
                </p>
              </div>
              <Badge variant="success">Read Authorized</Badge>
            </div>

            <div className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#172B4D]">Direct Company Career Pages</p>
                <p className="text-xs text-[#697586]">
                  Official RSS / Sitemap Feeds • Scraping & CAPTCHA bypass strictly prohibited
                </p>
              </div>
              <Badge variant="success">Read Authorized</Badge>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
