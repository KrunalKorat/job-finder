import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#172B4D]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full h-10 px-3.5 rounded-xl border text-sm text-[#263449] placeholder:text-[#9AA2B1] bg-white transition-colors duration-150 focus-ring disabled:bg-[#F8F7F3] disabled:text-[#9AA2B1] ${
            error
              ? "border-[#DC2626] focus:border-[#DC2626]"
              : "border-[#E6E8ED] hover:border-[#CBD2E1] focus:border-[#2563EB]"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[#DC2626] font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#697586]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
