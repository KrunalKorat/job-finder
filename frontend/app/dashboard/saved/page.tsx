"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyState } from "@/components/ui/empty-state";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function SavedJobsPage({ onOpenMobileMenu }: PageProps) {
  return (
    <>
      <DashboardHeader
        title="Saved Jobs"
        subtitle="Bookmarks and flagged opportunities for later review"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
        <EmptyState
          icon={Bookmark}
          title="No Saved Jobs Yet"
          description="As you explore positions in future phases, bookmark interesting postings here to track availability and prepare tailored application materials."
        />
      </main>
    </>
  );
}
