"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function AutomationCenterPage({ onOpenMobileMenu }: PageProps) {
  const { user, refreshUser } = useAuth();

  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [automationMode, setAutomationMode] = useState<"manual_review" | "semi_autonomous" | "full_autonomous">("manual_review");
  const [minMatchScore, setMinMatchScore] = useState<number>(80);
  const [maxPerDay, setMaxPerDay] = useState<number>(5);
  const [maxPerWeek, setMaxPerWeek] = useState<number>(20);
  const [approvedProviders, setApprovedProviders] = useState<string[]>([]);
  const [excludedEmployers, setExcludedEmployers] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.automation_setting) {
      const a = user.automation_setting;
      setAutomationEnabled(a.automation_enabled ?? false);
      setRequireApproval(a.require_approval ?? true);
      setAutomationMode(a.automation_mode || "manual_review");
      setMinMatchScore(a.min_match_score || 80);
      setMaxPerDay(a.max_applications_per_day || 5);
      setMaxPerWeek(a.max_applications_per_week || 20);
      setApprovedProviders(a.approved_providers || []);
      setExcludedEmployers(a.excluded_employers ? a.excluded_employers.join(", ") : "");
    }
  }, [user]);

  const toggleProvider = (providerId: string) => {
    if (approvedProviders.includes(providerId)) {
      setApprovedProviders(approvedProviders.filter((p) => p !== providerId));
    } else {
      setApprovedProviders([...approvedProviders, providerId]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (maxPerDay > maxPerWeek) {
      setErrorMessage("Daily application cap cannot exceed the weekly application cap.");
      setIsLoading(false);
      return;
    }

    const parseList = (str: string) =>
      str
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    try {
      await api.updateAutomationSettings({
        automation_enabled: automationEnabled,
        require_approval: requireApproval,
        automation_mode: automationMode,
        min_match_score: minMatchScore,
        max_applications_per_day: maxPerDay,
        max_applications_per_week: maxPerWeek,
        approved_providers: approvedProviders,
        excluded_employers: parseList(excludedEmployers),
      });
      await refreshUser();
      setSuccessMessage("Automation safety policies updated and saved to database.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update automation settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Automation Center"
        subtitle="Server-enforced submission guardrails and authorized provider approvals"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Compliance Manifesto Alert */}
        <div className="bg-[#EEF4FF] rounded-2xl border border-[#D0E2FF] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Policy Enforcement Engine</span>
          </div>
          <p className="text-sm text-[#263449] leading-relaxed">
            By default, all automated application submissions are <strong>strictly disabled</strong> and <strong>require explicit approval</strong>. Application submission access is evaluated independently from job reading access. We never bypass CAPTCHA, scrape unverified sites, or fabricate uncertain answers.
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-3 text-[#15803D] text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3 text-[#DC2626] text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Master Kill-Switch Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Master Automation Switch</CardTitle>
                  <CardDescription>
                    Enable or disable all automated submission operations globally
                  </CardDescription>
                </div>
                <Badge variant={automationEnabled ? "warning" : "neutral"}>
                  {automationEnabled ? "Enabled by User" : "Disabled (Default)"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#172B4D]">
                    Allow Automated Submissions
                  </p>
                  <p className="text-xs text-[#697586]">
                    Must be explicitly enabled by candidate. Leaves automation off when unchecked.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={automationEnabled}
                  onChange={(e) => setAutomationEnabled(e.target.checked)}
                  className="w-5 h-5 accent-[#2563EB] rounded cursor-pointer"
                />
              </div>

              {/* Approval Requirement */}
              <div className="p-4 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#172B4D]">
                    Require Candidate Approval
                  </p>
                  <p className="text-xs text-[#697586]">
                    Requires you to review every prepared application before submission.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-5 h-5 accent-[#2563EB] rounded cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Server-Side Rate Limits</CardTitle>
              <CardDescription>
                Strict daily and weekly quotas enforced in the database to prevent spam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Maximum Applications Per Day"
                    type="number"
                    min={1}
                    max={50}
                    value={maxPerDay}
                    onChange={(e) => setMaxPerDay(parseInt(e.target.value, 10) || 1)}
                    helperText="Recommended: 5 to 10 per day"
                  />
                </div>
                <div>
                  <Input
                    label="Maximum Applications Per Week"
                    type="number"
                    min={1}
                    max={250}
                    value={maxPerWeek}
                    onChange={(e) => setMaxPerWeek(parseInt(e.target.value, 10) || 1)}
                    helperText="Must be greater than or equal to daily quota"
                  />
                </div>
              </div>

              {/* Match Score Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
                    Minimum Compatibility Score
                  </label>
                  <span className="text-xs font-bold text-[#2563EB]">
                    {minMatchScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(parseInt(e.target.value, 10))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
                <p className="text-xs text-[#697586]">
                  Applications are blocked from preparation unless match score reaches this floor.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Approved Provider Whitelist Card */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Provider Whitelist</CardTitle>
              <CardDescription>
                Only authorized ATS integrations with verified terms can be selected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: "greenhouse",
                  name: "Greenhouse Harvest & Board Integration",
                  sub: "Official Greenhouse ATS • Programmatic submission requires employer partner API credentials",
                },
                {
                  id: "lever",
                  name: "Lever Postings Integration",
                  sub: "Official Lever ATS • Submissions require candidate consent and partner authentication",
                },
                {
                  id: "official_career_page",
                  name: "Direct Company Career Feeds",
                  sub: "Public career feeds • Manual handoff only in Phase 1",
                },
              ].map((prov) => {
                const checked = approvedProviders.includes(prov.id);
                return (
                  <div
                    key={prov.id}
                    onClick={() => toggleProvider(prov.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      checked
                        ? "bg-[#EEF4FF] border-[#2563EB]"
                        : "bg-white border-[#E6E8ED] hover:bg-[#F8F7F3]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#172B4D]">{prov.name}</p>
                      <p className="text-xs text-[#697586]">{prov.sub}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // Handled by parent div onClick
                      className="w-5 h-5 accent-[#2563EB] rounded cursor-pointer"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Excluded Employers Blacklist */}
          <Card>
            <CardHeader>
              <CardTitle>Excluded Employers Blacklist</CardTitle>
              <CardDescription>
                Employers you never want to submit applications to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                label="Excluded Company Names (Comma-separated)"
                type="text"
                placeholder="BadCorp, ShadyRecruiters, CurrentEmployerInc"
                value={excludedEmployers}
                onChange={(e) => setExcludedEmployers(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Automation Settings
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
