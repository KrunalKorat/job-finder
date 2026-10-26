"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function RecommendedJobsPage({ onOpenMobileMenu }: PageProps) {
  return (
    <>
      <DashboardHeader
        title="Recommended Jobs"
        subtitle="AI-assisted match scores and compatibility breakdowns"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        <EmptyState
          icon={Sparkles}
          title="Compatibility Matching — Scheduled for Phase 4"
          description="Phase 4 activates the matching engine comparing your verified resume skills and target preferences with active job requirements, generating match explanations and identifying skill gaps."
        />

        <div className="bg-white rounded-2xl border border-[#E6E8ED] p-6 space-y-3">
          <p className="text-sm font-bold text-[#172B4D]">
            Zero Fabricated Match Scores
          </p>
          <p className="text-sm text-[#697586] leading-relaxed">
            We never display fake job scores or imaginary job counts. Real recommendations will appear here once live job feeds and resume parsing are active.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                View Career Preferences
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
