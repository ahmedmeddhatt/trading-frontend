// Enhanced select component with validation
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(7)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {props.required && <span className="text-red-primary ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full px-3 py-2.5 rounded-lg appearance-none",
              "bg-dark-surface border transition-all duration-normal",
              "text-text-primary",
              "focus:outline-none focus:ring-2 focus:ring-green-primary/50",
              "pr-10",
              error
                ? "border-red-primary focus:border-red-primary"
                : "border-dark-border focus:border-green-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error || helperText
                ? `${selectId}-${error ? "error" : "helper"}`
                : undefined
            }
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
            <ChevronDown className="w-5 h-5" />
          </div>
          {error && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-primary pointer-events-none">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-red-primary flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${selectId}-helper`}
            className="mt-1.5 text-xs text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";



