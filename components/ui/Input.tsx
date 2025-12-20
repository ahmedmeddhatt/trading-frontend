// Enhanced input component with validation and feedback
"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            {label}
            {props.required && <span className="text-red-primary ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-3 py-2.5 rounded-lg",
              "bg-dark-surface border transition-all duration-normal",
              "text-text-primary placeholder:text-text-tertiary",
              "focus:outline-none focus:ring-2 focus:ring-green-primary/50",
              leftIcon && "pl-10",
              (rightIcon || error || success) && "pr-10",
              error
                ? "border-red-primary focus:border-red-primary"
                : success
                ? "border-green-primary focus:border-green-primary"
                : "border-dark-border focus:border-green-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error || helperText
                ? `${inputId}-${error ? "error" : "helper"}`
                : undefined
            }
            {...props}
          />
          {rightIcon && !error && !success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-primary">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-primary">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-primary flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-xs text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";



