import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "error" | "neutral" | "surface";
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#EEF4FF] text-[#2563EB] border border-[#D0E2FF]",
    success: "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]",
    error: "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
    neutral: "bg-[#F4F5F7] text-[#42526E] border border-[#E6E8ED]",
    surface: "bg-white text-[#263449] border border-[#E6E8ED]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
