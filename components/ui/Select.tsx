import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-text">
            {label}
          </label>
        )}
        <select
          ref={ref}
          dir="rtl"
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors bg-none",
            error ? "border-red-500 focus:ring-red-500" : "border-border",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
