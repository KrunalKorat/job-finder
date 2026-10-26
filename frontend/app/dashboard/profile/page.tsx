"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Save,
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

export default function ProfileAndPreferencesPage({ onOpenMobileMenu }: PageProps) {
  const { user, refreshUser } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<"profile" | "preferences">("profile");

  // Profile form state
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Career preferences state
  const [desiredTitles, setDesiredTitles] = useState("");
  const [skills, setSkills] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [workArrangements, setWorkArrangements] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<string>("");
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [preferredIndustries, setPreferredIndustries] = useState("");
  const [sponsorshipRequired, setSponsorshipRequired] = useState(false);
  const [excludedEmployers, setExcludedEmployers] = useState("");
  const [matchingThreshold, setMatchingThreshold] = useState<number>(75);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state from user on load
  useEffect(() => {
    if (user?.profile) {
      setName(user.profile.name || "");
      setHeadline(user.profile.professional_headline || "");
      setLocation(user.profile.location || "");
      setPortfolioUrl(user.profile.portfolio_url || "");
      setLinkedinUrl(user.profile.linkedin_url || "");
    }

    if (user?.career_preference) {
      const p = user.career_preference;
      setDesiredTitles(p.desired_job_titles ? p.desired_job_titles.join(", ") : "");
      setSkills(p.skills ? p.skills.join(", ") : "");
      setPreferredLocations(p.preferred_locations ? p.preferred_locations.join(", ") : "");
      setWorkArrangements(p.work_arrangements || []);
      setEmploymentTypes(p.employment_types || []);
      setMinSalary(p.min_salary ? String(p.min_salary) : "");
      setSalaryCurrency(p.salary_currency || "USD");
      setPreferredIndustries(p.preferred_industries ? p.preferred_industries.join(", ") : "");
      setSponsorshipRequired(p.sponsorship_required || false);
      setExcludedEmployers(p.excluded_employers ? p.excluded_employers.join(", ") : "");
      setMatchingThreshold(p.matching_threshold || 75);
    }
  }, [user]);

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await api.updateProfile({
        name: name.trim() || null,
        professional_headline: headline.trim() || null,
        location: location.trim() || null,
        portfolio_url: portfolioUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
      });
      await refreshUser();
      setSuccessMessage("Profile details updated successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const parseList = (str: string) =>
      str
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    try {
      await api.updateCareerPreferences({
        desired_job_titles: parseList(desiredTitles),
        skills: parseList(skills),
        preferred_locations: parseList(preferredLocations),
        work_arrangements: workArrangements,
        employment_types: employmentTypes,
        min_salary: minSalary ? parseInt(minSalary, 10) : null,
        salary_currency: salaryCurrency,
        preferred_industries: parseList(preferredIndustries),
        sponsorship_required: sponsorshipRequired,
        excluded_employers: parseList(excludedEmployers),
        matching_threshold: matchingThreshold,
      });
      await refreshUser();
      setSuccessMessage("Career preferences saved to database successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save career preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Resume & Profile"
        subtitle="Manage professional credentials and job matching requirements"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Tab Selector */}
        <div className="flex border-b border-[#E6E8ED] gap-8">
          <button
            onClick={() => {
              setActiveTab("profile");
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#697586] hover:text-[#172B4D]"
            }`}
          >
            Professional Profile
          </button>
          <button
            onClick={() => {
              setActiveTab("preferences");
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "preferences"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#697586] hover:text-[#172B4D]"
            }`}
          >
            Career Preferences
          </button>
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

        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>
                    Your public contact and portfolio links
                  </CardDescription>
                </div>
                <Badge variant="primary">
                  Status: {user?.profile?.profile_completion_status || "incomplete"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    label="Location"
                    type="text"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <Input
                  label="Professional Headline"
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer | Python, React, Distributed Systems"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Portfolio / Personal Site"
                    type="url"
                    placeholder="https://alexmorgan.dev"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />

                  <Input
                    label="LinkedIn Profile"
                    type="url"
                    placeholder="https://linkedin.com/in/alexmorgan"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: CAREER PREFERENCES */}
        {activeTab === "preferences" && (
          <Card>
            <CardHeader>
              <CardTitle>Career Preferences & Match Criteria</CardTitle>
              <CardDescription>
                Strict matching parameters used by our job discovery engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <Input
                  label="Target Job Titles (Comma-separated)"
                  type="text"
                  placeholder="Full Stack Engineer, Senior Backend Developer, Staff Platform Engineer"
                  helperText="List specific roles you want the engine to prioritize"
                  value={desiredTitles}
                  onChange={(e) => setDesiredTitles(e.target.value)}
                />

                <Input
                  label="Key Skills (Comma-separated)"
                  type="text"
                  placeholder="Python, FastAPI, TypeScript, React, PostgreSQL, Docker, Kubernetes"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />

                <Input
                  label="Preferred Geographic Locations"
                  type="text"
                  placeholder="San Francisco, New York, Austin, Remote Worldwide"
                  value={preferredLocations}
                  onChange={(e) => setPreferredLocations(e.target.value)}
                />

                {/* Work Arrangements */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
                    Work Arrangements
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: "remote", label: "Remote" },
                      { id: "hybrid", label: "Hybrid" },
                      { id: "onsite", label: "Onsite" },
                    ].map((item) => {
                      const checked = workArrangements.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            toggleArrayItem(workArrangements, setWorkArrangements, item.id)
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            checked
                              ? "bg-[#EEF4FF] text-[#2563EB] border-[#2563EB]"
                              : "bg-white text-[#697586] border-[#E6E8ED] hover:bg-[#F8F7F3]"
                          }`}
                        >
                          {checked ? "✓ " : "+ "}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Employment Types */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
                    Employment Types
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: "full_time", label: "Full-Time" },
                      { id: "contract", label: "Contract" },
                      { id: "part_time", label: "Part-Time" },
                      { id: "internship", label: "Internship" },
                    ].map((item) => {
                      const checked = employmentTypes.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            toggleArrayItem(employmentTypes, setEmploymentTypes, item.id)
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            checked
                              ? "bg-[#EEF4FF] text-[#2563EB] border-[#2563EB]"
                              : "bg-white text-[#697586] border-[#E6E8ED] hover:bg-[#F8F7F3]"
                          }`}
                        >
                          {checked ? "✓ " : "+ "}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compensation & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Minimum Annual Salary Floor"
                      type="number"
                      min={0}
                      step={5000}
                      placeholder="e.g. 140000"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D] mb-1.5">
                      Currency
                    </label>
                    <select
                      value={salaryCurrency}
                      onChange={(e) => setSalaryCurrency(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E6E8ED] bg-white text-sm text-[#263449] focus-ring"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                </div>

                {/* Excluded Employers Blacklist */}
                <Input
                  label="Excluded Employers Blacklist (Comma-separated)"
                  type="text"
                  placeholder="UnwantedCo, SpamRecruiters LLC"
                  helperText="These companies will never be presented or submitted to under any circumstances"
                  value={excludedEmployers}
                  onChange={(e) => setExcludedEmployers(e.target.value)}
                />

                {/* Matching Threshold */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
                      Minimum Job Match Threshold
                    </label>
                    <span className="text-xs font-bold text-[#2563EB]">
                      {matchingThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={matchingThreshold}
                    onChange={(e) => setMatchingThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                  <p className="text-[11px] text-[#697586]">
                    Jobs with a calculated compatibility score below this number will be excluded from recommendations.
                  </p>
                </div>

                {/* Work Authorization Checkbox */}
                <div className="p-4 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#172B4D]">
                      Visa / Sponsorship Required
                    </p>
                    <p className="text-xs text-[#697586]">
                      Flag positions that explicitly indicate visa sponsorship support
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sponsorshipRequired}
                    onChange={(e) => setSponsorshipRequired(e.target.checked)}
                    className="w-5 h-5 accent-[#2563EB] rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Career Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
