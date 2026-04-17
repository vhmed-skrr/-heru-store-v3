"use client";

import React from 'react';
import { Category } from '@/types';

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ShopFilters({ categories, selectedCategory, onSelectCategory, sortBy, onSortChange }: ShopFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center w-full mb-8">
      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null 
              ? 'bg-brand-600 text-white shadow-md' 
              : 'bg-white text-text-main border border-border hover:border-brand-600 hover:text-brand-600'
          }`}
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white text-text-main border border-border hover:border-brand-600 hover:text-brand-600'
            }`}
          >
            {cat.name_ar}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="relative shrink-0">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          dir="rtl"
          className="appearance-none bg-white border border-border rounded-lg pl-10 pr-4 py-2 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-brand-600 hover:border-brand-600 transition-colors cursor-pointer w-full md:w-auto"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل للأعلى</option>
          <option value="price_desc">السعر: من الأعلى للأقل</option>
        </select>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-sec">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </div>
  );
}
