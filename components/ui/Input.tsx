import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          dir="rtl"
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-text placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error ? "border-red-500 focus:ring-red-500" : "border-border",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
