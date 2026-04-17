import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'highlight';
}

export function StatsCard({ title, value, description, icon, variant = 'default' }: StatsCardProps) {
  const isHighlight = variant === 'highlight';
  
  return (
    <div className={`p-6 rounded-2xl border flex flex-col gap-4 shadow-sm transition-shadow hover:shadow-md ${
      isHighlight 
        ? 'bg-brand-600 border-brand-600 text-white' 
        : 'bg-white border-border text-text-main'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-opacity-20 ${
          isHighlight ? 'bg-white text-white' : 'bg-brand-50 text-brand-600'
        }`}>
          {icon}
        </div>
      </div>
      
      <div>
        <div className={`text-sm font-bold mb-1.5 ${isHighlight ? 'text-brand-100' : 'text-text-sec'}`}>
          {title}
        </div>
        <div className="text-3xl font-black tabular-nums tracking-tight">
          {value}
        </div>
        {description && (
          <div className={`text-xs mt-3 font-medium ${isHighlight ? 'text-brand-200' : 'text-text-sec/80'} leading-relaxed`}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
