"use client";

import React, { useState, useTransition } from 'react';
import { useToast } from '@/components/ui/Toast';
import {
  addSectionToHomepage,
  removeSectionFromHomepage,
  updateSectionOrder,
  toggleSectionVisibility,
} from '@/lib/actions/adminHomepageSections';

export interface SectionCategory {
  id: string;
  name_ar: string;
  icon: string | null;
  sort_order: number;
  show_on_homepage: boolean;
  product_count: number;
}

interface HomepageSectionsClientProps {
  featured: SectionCategory[];
  available: SectionCategory[];
}

export function HomepageSectionsClient({ featured, available }: HomepageSectionsClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Local optimistic state mirrors for instant UI feedback
  const [featuredList, setFeaturedList] = useState<SectionCategory[]>(featured);
  const [availableList, setAvailableList] = useState<SectionCategory[]>(available);
  const [showDropdown, setShowDropdown] = useState(false);
  const [orderEditing, setOrderEditing] = useState<Record<string, number>>({});

  // ── Add Section ───────────────────────────────────────────────
  const handleAdd = (cat: SectionCategory) => {
    setShowDropdown(false);
    startTransition(async () => {
      const updated: SectionCategory = { ...cat, show_on_homepage: true };
      setFeaturedList((prev) => [...prev, updated].sort((a, b) => a.sort_order - b.sort_order));
      setAvailableList((prev) => prev.filter((c) => c.id !== cat.id));

      const { success, error } = await addSectionToHomepage(cat.id);
      if (!success) {
        // Revert
        setFeaturedList((prev) => prev.filter((c) => c.id !== cat.id));
        setAvailableList((prev) => [...prev, cat].sort((a, b) => a.sort_order - b.sort_order));
        toast(`فشل الإضافة: ${error}`, 'error');
      } else {
        toast(`تمت إضافة "${cat.name_ar}" للرئيسية`, 'success');
      }
    });
  };

  // ── Remove Section ────────────────────────────────────────────
  const handleRemove = (cat: SectionCategory) => {
    startTransition(async () => {
      setFeaturedList((prev) => prev.filter((c) => c.id !== cat.id));
      setAvailableList((prev) => [...prev, { ...cat, show_on_homepage: false }].sort((a, b) => a.sort_order - b.sort_order));

      const { success, error } = await removeSectionFromHomepage(cat.id);
      if (!success) {
        setFeaturedList((prev) => [...prev, cat].sort((a, b) => a.sort_order - b.sort_order));
        setAvailableList((prev) => prev.filter((c) => c.id !== cat.id));
        toast(`فشل الحذف: ${error}`, 'error');
      } else {
        toast(`تمت إزالة "${cat.name_ar}" من الرئيسية`, 'success');
      }
    });
  };

  // ── Toggle Visibility ─────────────────────────────────────────
  const handleToggle = (cat: SectionCategory, visible: boolean) => {
    startTransition(async () => {
      setFeaturedList((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, show_on_homepage: visible } : c))
      );

      const { success, error } = await toggleSectionVisibility(cat.id, visible);
      if (!success) {
        setFeaturedList((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, show_on_homepage: !visible } : c))
        );
        toast(`فشل تحديث الظهور: ${error}`, 'error');
      } else {
        toast(visible ? `"${cat.name_ar}" أصبح ظاهراً` : `"${cat.name_ar}" أصبح مخفياً`, 'success');
      }
    });
  };

  // ── Sort Order ────────────────────────────────────────────────
  const handleOrderBlur = (cat: SectionCategory) => {
    const newOrder = orderEditing[cat.id];
    if (newOrder === undefined || newOrder === cat.sort_order) return;

    startTransition(async () => {
      setFeaturedList((prev) =>
        prev
          .map((c) => (c.id === cat.id ? { ...c, sort_order: newOrder } : c))
          .sort((a, b) => a.sort_order - b.sort_order)
      );

      const { success, error } = await updateSectionOrder(cat.id, newOrder);
      if (!success) {
        setFeaturedList((prev) =>
          prev
            .map((c) => (c.id === cat.id ? { ...c, sort_order: cat.sort_order } : c))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        toast(`فشل تحديث الترتيب: ${error}`, 'error');
      } else {
        toast('تم تحديث الترتيب', 'success');
      }

      setOrderEditing((prev) => {
        const next = { ...prev };
        delete next[cat.id];
        return next;
      });
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            سيكشنات الصفحة الرئيسية
          </h1>
          <p className="text-text-sec text-sm mt-1 font-medium">
            اختر التصنيفات التي تظهر كـ Section مستقل في الصفحة الرئيسية
          </p>
        </div>

        {/* Add Section Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            disabled={availableList.length === 0 || isPending}
            className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            إضافة Section جديد
          </button>

          {showDropdown && availableList.length > 0 && (
            <div className="absolute start-0 top-full mt-2 w-64 bg-white rounded-xl border border-border shadow-2xl z-50 overflow-hidden">
              <div className="p-2 border-b border-border">
                <span className="text-xs font-bold text-text-sec px-2">اختر تصنيفاً لإضافته</span>
              </div>
              <ul className="max-h-64 overflow-y-auto">
                {availableList.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleAdd(cat)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-50 text-text-main transition-colors text-sm font-medium text-right"
                    >
                      <span className="text-base">{cat.icon || '🏷️'}</span>
                      <span className="flex-1">{cat.name_ar}</span>
                      <span className="text-text-sec text-xs">{cat.product_count} منتج</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Click-outside overlay for dropdown ───────────────── */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {featuredList.length === 0 ? (
          <div className="p-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <p className="font-arabic font-bold text-text-sec text-lg">لا توجد سيكشنات مضافة بعد</p>
            <p className="text-text-sec text-sm mt-1">اضغط "إضافة Section جديد" لتبدأ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-bg-secondary border-b border-border text-sm font-bold text-text-sec">
                  <th className="p-4 text-center w-20">الترتيب</th>
                  <th className="p-4">اسم التصنيف</th>
                  <th className="p-4 text-center">عدد المنتجات</th>
                  <th className="p-4 text-center">يظهر؟</th>
                  <th className="p-4 text-center w-24">إزالة</th>
                </tr>
              </thead>
              <tbody>
                {featuredList.map((cat) => (
                  <tr
                    key={cat.id}
                    className={`border-b border-border transition-colors ${isPending ? 'opacity-60' : 'hover:bg-bg-secondary/50'}`}
                  >
                    {/* Sort Order */}
                    <td className="p-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={orderEditing[cat.id] ?? cat.sort_order}
                        onChange={(e) =>
                          setOrderEditing((prev) => ({ ...prev, [cat.id]: parseInt(e.target.value) || 0 }))
                        }
                        onBlur={() => handleOrderBlur(cat)}
                        disabled={isPending}
                        className="w-16 h-9 text-center rounded-lg border border-border bg-brand-50 text-brand-600 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:opacity-50"
                      />
                    </td>

                    {/* Category Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-text-main">
                        <span className="text-base">{cat.icon || '🏷️'}</span>
                        <span>{cat.name_ar}</span>
                      </div>
                    </td>

                    {/* Product Count */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full text-xs font-bold ${
                          cat.product_count === 0
                            ? 'bg-red-50 text-red-500 border border-red-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}
                      >
                        {cat.product_count}
                      </span>
                    </td>

                    {/* Toggle Visibility */}
                    <td className="p-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={cat.show_on_homepage}
                          onChange={(e) => handleToggle(cat, e.target.checked)}
                          disabled={isPending}
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                      </label>
                    </td>

                    {/* Remove Button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRemove(cat)}
                        disabled={isPending}
                        title="إزالة من الرئيسية"
                        className="w-8 h-8 flex items-center justify-center mx-auto rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Info Box ─────────────────────────────────────────── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <div className="text-sm text-brand-700 font-medium leading-relaxed">
          <strong>ملاحظات:</strong>
          <ul className="mt-1 list-disc list-inside space-y-1 text-brand-600">
            <li>الإزالة لا تحذف التصنيف — فقط تخفيه من الرئيسية.</li>
            <li>التصنيفات ذات عدد المنتجات = 0 لن تظهر في الرئيسية حتى لو مفعّلة.</li>
            <li>الترتيب يُحفظ تلقائياً عند الخروج من حقل الرقم.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
