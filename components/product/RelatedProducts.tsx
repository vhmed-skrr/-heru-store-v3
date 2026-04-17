import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-arabic font-bold text-text-main mb-8 border-b border-border pb-4 w-max">
        منتجات مشابهة
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
