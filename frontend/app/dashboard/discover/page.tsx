"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function DiscoverJobsPage({ onOpenMobileMenu }: PageProps) {
  return (
    <>
      <DashboardHeader
        title="Discover Jobs"
        subtitle="Search verified openings from official career portals"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        <EmptyState
          icon={Compass}
          title="Job Discovery Module — Scheduled for Phase 3"
          description="In Phase 3, this module connects to official Greenhouse, Lever, and direct career page feeds to search and normalize listings without web scraping."
        />

        <div className="bg-white rounded-2xl border border-[#E6E8ED] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            <ShieldCheck className="w-4 h-4" />
            <span>Preparation in Progress</span>
          </div>
          <p className="text-sm text-[#697586] leading-relaxed">
            Configure your target job titles and location preferences in your profile now so that when the discovery adapters initialize, relevant jobs are filtered automatically.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm">
                Configure Career Preferences
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
