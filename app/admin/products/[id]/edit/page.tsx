import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';

export default async function EditProductPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const [{ data: product }, { data: categories }] = await Promise.all([
    getProductById(params.id),
    getCategories()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 text-sm mb-2">
        <Link href="/admin/products" className="font-medium text-text-sec hover:text-brand-600 transition-colors flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          العودة للمنتجات
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-arabic text-text-main mb-2">تعديل التخزين والبيانات</h1>
        <p className="text-text-sec font-medium">التعديل على بيانات "{product.name_ar}"</p>
      </div>

      <ProductForm initialData={product} categories={categories || []} />
    </div>
  );
}
