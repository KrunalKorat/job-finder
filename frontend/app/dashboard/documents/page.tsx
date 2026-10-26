"use client";

import React from "react";
import { FolderArchive } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyState } from "@/components/ui/empty-state";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function DocumentsPage({ onOpenMobileMenu }: PageProps) {
  return (
    <>
      <DashboardHeader
        title="Documents"
        subtitle="Manage tailored resumes, cover letters, and application attachments"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full">
        <EmptyState
          icon={FolderArchive}
          title="Document Vault — Scheduled for Phase 5"
          description="Phase 5 activates automated generation of tailored resume variants, custom cover letters, and editable portfolio attachments tailored to specific job postings."
        />
      </main>
    </>
  );
}
