import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';

export function FeaturedProducts({ products }: { products: Product[] | null }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-arabic font-bold text-text-main">
            منتجات مميزة
          </h2>
          <Link href="/shop" className="text-brand-600 font-medium hover:underline flex items-center gap-1">
            مشاهدة الكل
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
