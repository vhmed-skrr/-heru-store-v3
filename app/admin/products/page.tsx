import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [{ data: products, error }, { data: categories }] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCategories(false),
  ]);

  if (error) {
    console.error('[AdminProducts] getProducts error:', error);
  }

  const categoryMap = new Map(categories?.map(c => [c.id, c.name_ar]) ?? []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إدارة المنتجات</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">عرض وتعديل وحذف المنتجات الموجودة بالمتجر</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 shrink-0 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          إضافة منتج جديد
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-bg-secondary border-b border-border text-sm font-bold text-text-sec">
                <th className="p-4 w-20">الصورة</th>
                <th className="p-4">اسم المنتج</th>
                <th className="p-4">السعر</th>
                <th className="p-4">المخزون</th>
                <th className="p-4">التصنيف</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 w-28 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-text-sec font-medium">
                    {error ? `خطأ: ${error}` : 'لا توجد منتجات. ابدأ بإضافة منتج جديد.'}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const catId = typeof product.category_id === 'object'
                    ? (product.category_id as any)?.id
                    : product.category_id;

                  return (
                    <tr key={product.id} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 relative rounded border border-border overflow-hidden bg-bg-secondary">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name_ar} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-text-sec">-</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-text-main">
                        <div className="max-w-[200px] truncate">{product.name_ar}</div>
                      </td>
                      <td className="p-4 tabular-nums font-bold text-brand-600">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${product.stock > 0 ? 'bg-success-50 text-success-600 border border-success-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {product.stock} حبة
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-text-sec">{categoryMap.get(catId ?? '') || 'غير محدد'}</td>
                      <td className="p-4">
                        {product.active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-success-50 text-success-600 border border-success-200">نشط</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-border">مخفي</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            title="تعديل"
                            className="w-8 h-8 flex items-center justify-center rounded bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </Link>
                          {/*
                            DeleteProductButton is a Client Component.
                            The old code had window.confirm directly inside
                            this Server Component → ReferenceError → page crash.
                          */}
                          <DeleteProductButton productId={product.id} productName={product.name_ar} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
