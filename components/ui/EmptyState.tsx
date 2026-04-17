import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center bg-background",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-brand-600 bg-brand-50 p-4 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-text">{title}</h3>
      <p className="mb-4 text-sm text-text-sec max-w-sm">{description}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
