import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'image';
}

export function Skeleton({ variant = 'text', className, ...props }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-brand-50 rounded-md";
  
  const variants = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    image: "h-48 w-full",
  };

  return (
    <div className={cn(baseClasses, variants[variant], className)} {...props} />
  );
}
