import React from "react";

export interface StatusIndicatorProps {
  status: "active" | "inactive" | "warning" | "error" | "pending";
  label?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  className = "",
}: StatusIndicatorProps) {
  const dotStyles = {
    active: "bg-[#15803D] ring-4 ring-[#DCFCE7]",
    inactive: "bg-[#9AA2B1] ring-4 ring-[#F1F3F5]",
    warning: "bg-[#B45309] ring-4 ring-[#FEF3C7]",
    error: "bg-[#DC2626] ring-4 ring-[#FEE2E2]",
    pending: "bg-[#2563EB] ring-4 ring-[#DBEAFE] animate-pulse",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyles[status]}`} />
      {label && <span className="text-xs font-medium text-[#263449]">{label}</span>}
    </div>
  );
}
