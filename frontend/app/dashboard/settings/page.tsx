"use client";

import React from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface PageProps {
  onOpenMobileMenu?: () => void;
}

export default function SettingsPage({ onOpenMobileMenu }: PageProps) {
  const { user, logout } = useAuth();

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Account preferences, security controls, and session state"
        onOpenMobileMenu={onOpenMobileMenu || (() => {})}
      />
      <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Authenticated candidate account metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y divide-[#E6E8ED] text-sm">
              <div className="py-3 flex justify-between items-center">
                <span className="text-[#697586]">Primary Email</span>
                <span className="font-bold text-[#172B4D]">{user?.email}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[#697586]">Verification Status</span>
                <Badge variant={user?.is_verified ? "success" : "warning"}>
                  {user?.is_verified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[#697586]">Account Status</span>
                <Badge variant="primary">{user?.status || "Active"}</Badge>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[#697586]">Member Since</span>
                <span className="text-[#263449]">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6E8ED] flex justify-end">
              <Button variant="danger" size="md" onClick={() => logout()}>
                Sign Out of Job Finder
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
