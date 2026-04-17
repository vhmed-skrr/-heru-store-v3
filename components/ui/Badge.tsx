import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'sale' | 'featured';
  percentage?: string;
}

export function Badge({ variant = 'new', percentage, className, children, ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";
  
  const variants = {
    new: "bg-success-500 text-white",
    sale: "bg-orange-500 text-white",
    featured: "bg-brand-600 text-white",
  };

  const content = variant === 'sale' && percentage ? `خصم ${percentage}` : children || variant;

  return (
    <span className={cn(baseClasses, variants[variant], className)} {...props}>
      {content}
    </span>
  );
}
