"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  Compass,
  FolderArchive,
  LayoutDashboard,
  LogOut,
  Send,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover Jobs", href: "/dashboard/discover", icon: Compass },
    { name: "Recommended Jobs", href: "/dashboard/recommended", icon: Sparkles },
    { name: "Saved Jobs", href: "/dashboard/saved", icon: Bookmark },
    { name: "Applications", href: "/dashboard/applications", icon: Send },
    { name: "Automation Center", href: "/dashboard/automation", icon: Sliders },
    { name: "Resume & Profile", href: "/dashboard/profile", icon: UserCircle },
    { name: "Documents", href: "/dashboard/documents", icon: FolderArchive },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-[#E6E8ED]">
      {/* Brand */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#E6E8ED]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#172B4D] tracking-tight">Job Finder</span>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#697586] hover:bg-[#F8F7F3]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#9AA2B1]">
          Platform Modules
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#EEF4FF] text-[#2563EB] font-bold"
                  : "text-[#42526E] hover:text-[#172B4D] hover:bg-[#F8F7F3]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#2563EB]" : "text-[#697586]"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User profile & Sign out */}
      <div className="p-4 border-t border-[#E6E8ED] bg-[#F8F7F3]/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] border border-[#D0E2FF] flex items-center justify-center text-[#2563EB] font-bold text-xs shrink-0">
              {user?.profile?.name
                ? user.profile.name.charAt(0).toUpperCase()
                : user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#172B4D] truncate">
                {user?.profile?.name || user?.email.split("@")[0]}
              </p>
              <p className="text-[11px] text-[#697586] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded-lg text-[#697586] hover:text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#BBF7D0]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Policy Safeguards Active</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#172B4D]/30 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
