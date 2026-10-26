"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { api } from "@/lib/api";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({
  title,
  subtitle,
  onOpenMobileMenu,
}: HeaderProps) {
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  useEffect(() => {
    api
      .getHealthLive()
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-[#E6E8ED] bg-white flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#263449] hover:bg-[#F8F7F3] focus-ring"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#172B4D] tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-[#697586] -mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F7F3] border border-[#E6E8ED]">
          <StatusIndicator
            status={apiHealthy ? "active" : "warning"}
            label={apiHealthy ? "FastAPI Live" : "API Degraded"}
          />
        </div>
      </div>
    </header>
  );
}
