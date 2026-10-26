import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#E6E8ED] ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-[#172B4D] mb-1">{title}</h4>
      <p className="text-sm text-[#697586] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
