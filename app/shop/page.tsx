import React from 'react';
import { getCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { ShopClientSection } from '@/components/shop/ShopClientSection';

export const revalidate = 30;

export const metadata = {
  title: 'المتجر',
  description: 'تصفح جميع المنتجات المتاحة في المتجر',
};

export default async function ShopPage() {
  const [
    { data: categories },
    { data: allProducts }
  ] = await Promise.all([
    getCategories(),
    getProducts({ limit: 200 })
  ]);

  return (
    <>
      <main className="flex-1 flex flex-col bg-bg-secondary min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-arabic font-bold text-text-main mb-2">المتجر</h1>
            <p className="text-text-sec">تصفح تشكيلتنا المميزة من المنتجات</p>
          </div>
          
          <ShopClientSection 
            allProducts={allProducts || []} 
            categories={categories || []} 
          />
        </div>
      </main>
    </>
  );
}
