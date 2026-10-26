import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-xs active:translate-y-[0.5px]",
      secondary:
        "bg-[#EEF4FF] text-[#2563EB] hover:bg-[#E0ECFF] border border-[#D0E2FF]",
      outline:
        "bg-white text-[#263449] border border-[#E6E8ED] hover:bg-[#F8F7F3] hover:border-[#D5D9E0]",
      ghost:
        "bg-transparent text-[#697586] hover:text-[#172B4D] hover:bg-[#F0EFF4]",
      danger:
        "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-xs",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
      md: "text-sm px-4 py-2 h-10 gap-2",
      lg: "text-base px-6 py-2.5 h-12 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
