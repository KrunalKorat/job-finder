"use client";

import React from "react";
import Link from "next/link";
import { Send, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function ApplicationsPage({ onOpenMobileMenu }: PageProps) {
  return (
    <>
      <DashboardHeader
        title="Applications"
        subtitle="Track submission status, timeline events, and interview stages"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        <EmptyState
          icon={Send}
          title="Application Pipeline — Scheduled for Phase 6 & 7"
          description="Phase 6 introduces provider-authorized application submissions and audit logs. Phase 7 implements comprehensive interview stages, response logs, and offer tracking."
        />

        <div className="bg-white rounded-2xl border border-[#E6E8ED] p-6 space-y-3">
          <p className="text-sm font-bold text-[#172B4D]">
            Compliance Reminder
          </p>
          <p className="text-sm text-[#697586] leading-relaxed">
            Automatic application submissions will only ever operate through explicitly authorized integrations with your prior approval and configured rate caps.
          </p>
          <div className="pt-2">
            <Link href="/dashboard/automation">
              <Button variant="outline" size="sm">
                Review Automation Safeguards
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
