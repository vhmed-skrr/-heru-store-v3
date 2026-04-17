"use client";

import React from 'react';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'cash',
    name: 'الدفع عند الاستلام',
    description: 'ادفع نقداً عند استلام طلبك',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  },
  {
    id: 'instapay',
    name: 'إنستاباي (InstaPay)',
    description: 'تحويل نقدي فوري عبر تطبيق إنستاباي',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
  },
  {
    id: 'vodafone_cash',
    name: 'فودافون كاش',
    description: 'تحويل عبر محفظة فودافون كاش',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
  }
];

interface PaymentSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {paymentOptions.map((option) => (
        <label 
          key={option.id}
          className={`flex items-start gap-4 p-4 rounded-xl border border-border cursor-pointer transition-all ${
            value === option.id 
              ? 'bg-brand-50 border-brand-600 ring-1 ring-brand-600' 
              : 'bg-white hover:border-brand-300'
          }`}
        >
          <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border flex-shrink-0 transition-colors ${
            value === option.id ? 'border-brand-600 bg-brand-600' : 'border-text-sec bg-white'
          }`}>
            {value === option.id && <div className="w-2 h-2 rounded-full bg-white flex-shrink-0" />}
          </div>
          
          <div className={`flex flex-col flex-1 ${value === option.id ? 'text-brand-700' : 'text-text-sec'}`}>
            <div className="flex items-center gap-2 mb-1 text-text-main font-bold">
              {option.icon}
              <span className={value === option.id ? 'text-brand-700' : 'text-text-main'}>
                {option.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {option.description}
            </p>
          </div>
          <input 
            type="radio" 
            name="payment_method" 
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
}
