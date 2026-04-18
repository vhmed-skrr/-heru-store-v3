import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getProducts } from '@/lib/data/products';
import { ProductCarousel } from './ProductCarousel';

interface CategorySectionProps {
  category: Category;
}

export async function CategorySection({ category }: CategorySectionProps) {
  // Fetch up to 10 active products for this specific category
  const { data: products } = await getProducts({ 
    category_id: category.id, 
    limit: 10 
  });

  // If no products, do not render the section
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-bg-main py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black font-arabic text-text-main md:text-4xl tracking-tight uppercase border-r-4 border-brand-600 pr-3">
            {category.name_ar}
          </h2>
          <Link 
            href={`/shop?category=${category.id}`} 
            className="text-sm font-bold text-text-sec flex items-center gap-1 hover:text-brand-600 transition-colors bg-bg-secondary px-4 py-2 rounded-full border border-border"
          >
            مشاهدة الكل
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>

        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
