"use client";

import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-sec">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input
        type="text"
        dir="rtl"
        placeholder="ابحث عن منتج..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full h-11 pl-4 pr-10 py-2 rounded-lg border border-border bg-white text-text-main placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
      />
    </div>
  );
}
