import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/data/categories';
import { deleteCategory } from '@/lib/actions/adminCategories';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const { data: categories } = await getCategories();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    await deleteCategory(id);
    revalidatePath('/admin/categories');
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إدارة التصنيفات</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">عرض وتعديل وحذف أقسام ومنتجات المتجر</p>
        </div>
        <Link 
          href="/admin/categories/new" 
          className="flex items-center gap-2 px-6 py-3 shrink-0 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          إضافة تصنيف جديد
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-bg-secondary border-b border-border text-sm font-bold text-text-sec">
                <th className="p-4 w-20">الصورة</th>
                <th className="p-4">الاسم والأيقونة</th>
                <th className="p-4">اللون المميز</th>
                <th className="p-4">الترتيب</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 w-28 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {!categories || categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-sec font-medium">لا توجد تصنيفات حالياً. ابدأ بإضافة تصنيف جديد.</td>
                </tr>
              ) : (
                categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((category) => (
                  <tr key={category.id} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 relative rounded border border-border overflow-hidden bg-bg-secondary flex items-center justify-center">
                        {category.image_url ? (
                          <Image src={category.image_url} alt={category.name_ar} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-text-sec">-</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-text-main">
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name_ar}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: category.color || '#eee' }}></div>
                        <span className="text-sm font-medium text-text-sec" dir="ltr">{category.color}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-brand-50 text-brand-600 font-bold text-sm">
                        {category.sort_order || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      {category.active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-success-50 text-success-600 border border-success-200">نشط</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-border">مخفي</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/admin/categories/${category.id}/edit`}
                          title="تعديل"
                          className="w-8 h-8 flex items-center justify-center rounded bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Link>
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={category.id} />
                          <button 
                            type="submit"
                            title="حذف"
                            onClick={(e) => {
                              if (!window.confirm('ملاحظة هامة: هل أنت متأكد من حذف هذا التصنيف نهائياً؟')) e.preventDefault();
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
