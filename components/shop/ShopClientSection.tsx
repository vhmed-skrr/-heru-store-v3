"use client";

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import { SearchBar } from './SearchBar';
import { ShopFilters } from './ShopFilters';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ShopClientSectionProps {
  allProducts: Product[];
  categories: Category[];
}

export function ShopClientSection({ allProducts, categories }: ShopClientSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name_ar.toLowerCase().includes(q) || 
        (p.name_en && p.name_en.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory || 
                                  (typeof p.category_id === 'object' && (p.category_id as any).id === selectedCategory));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <ShopFilters 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>}
          title="لا توجد نتائج"
          description="لم نتمكن من العثور على منتجات تطابق بحثك. جرب استخدام كلمات مختلفة."
          className="py-16 bg-white"
        />
      )}
    </div>
  );
}
