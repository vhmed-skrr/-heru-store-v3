"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { approveReview, deleteReview } from '@/lib/actions/adminReviews';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('product'); // 'product' | 'store'
  const [unapprovedOnly, setUnapprovedOnly] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase.from('reviews').select('*, product:product_id(*)').order('created_at', { ascending: false });
      
      if (activeTab === 'store') {
        query = query.is('product_id', null);
      } else {
        query = query.not('product_id', 'is', null);
      }

      if (unapprovedOnly) {
        query = query.eq('approved', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setReviews(data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab, unapprovedOnly]);

  const handleApprove = async (id: string) => {
    const { success, error } = await approveReview(id);
    if (success) { 
        toast("تمت الموافقة بنجاح على عرض التقييم", "success"); 
        fetchReviews(); 
    }
    else {
        toast(`خطأ: ${error}`, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("تحذير: هل أنت متأكد من حذف التقييم نهائياً بشكل مسجل من النظام؟")) {
      const { success, error } = await deleteReview(id);
      if (success) { 
          toast("تم مسح التقييم من السجلات", "success"); 
          fetchReviews(); 
      }
      else {
          toast(`خطأ: ${error}`, "error");
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 text-yellow-400">
        {[1,2,3,4,5].map(star => (
          <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إدارة التقييمات والمراجعات</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">متابعة ومراجعة تقييمات العملاء لمتجرك ولمنتجاتك بشكل تنظيمي يحافظ على المصداقية</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-border shadow-sm">
        <div className="flex bg-bg-secondary p-1.5 rounded-xl w-full sm:w-auto border border-border/70">
          <button 
            onClick={() => setActiveTab('product')} 
            className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'product' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-border' : 'text-text-sec hover:text-text-main hover:bg-white/50'}`}
          >
            تقييمات المنتجات
          </button>
          <button 
            onClick={() => setActiveTab('store')} 
            className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'store' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-border' : 'text-text-sec hover:text-text-main hover:bg-white/50'}`}
          >
            تقييمات المتجر
          </button>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer bg-orange-50 px-5 py-3 rounded-xl border border-orange-200 text-orange-700 w-full sm:w-auto mt-2 sm:mt-0 transition-colors hover:bg-orange-100">
          <input type="checkbox" checked={unapprovedOnly} onChange={(e) => setUnapprovedOnly(e.target.checked)} className="w-5 h-5 text-orange-600 rounded border-orange-300 focus:ring-orange-500" />
          <span className="font-bold text-sm">عرض التقييمات المعلقة (بحاجة لاعتماد)</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-bg-secondary border-b border-border text-xs font-bold text-text-sec tracking-wide whitespace-nowrap">
              <tr>
                <th className="p-5 w-48">معلومات العميل</th>
                <th className="p-5 w-32">نوع التقييم</th>
                <th className="p-5">نص المراجعة</th>
                {activeTab === 'product' && <th className="p-5 w-60">المنتج المرتبط</th>}
                <th className="p-5 text-center w-28">حالة الظهور</th>
                <th className="p-5 text-center w-36">إجراءات المراجعة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={activeTab === 'product' ? 6 : 5} className="p-16 text-center"><div className="animate-spin w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 mx-auto"></div></td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={activeTab === 'product' ? 6 : 5} className="p-16 text-center text-text-sec font-medium text-lg border-t border-dashed border-border mt-5 block w-full mx-auto">لا توجد سجلات تطابق الفلتر الحالي</td></tr>
              ) : reviews.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-bg-secondary/40 transition-colors">
                  <td className="p-5 align-top">
                    <div className="font-black text-text-main mb-1.5">{r.reviewer_name}</div>
                    <div className="text-xs font-medium text-text-sec bg-bg-secondary w-max px-2 py-0.5 rounded border border-border" dir="ltr">{new Date(r.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="p-5 align-top">{renderStars(r.rating)}</td>
                  <td className="p-5 whitespace-normal min-w-[200px] align-top">
                    <p className="text-sm text-text-main font-medium leading-relaxed bg-bg-secondary p-3 rounded-lg border border-border/30">{r.comment || <span className="text-text-sec italic text-xs">اكتفى العميل بالتقييم العددي بدون ترك أي تعليق نصي إضافي.</span>}</p>
                  </td>
                  {activeTab === 'product' && (
                    <td className="p-5 text-sm font-bold text-text-main whitespace-normal align-top">
                      <div className="max-w-[200px] line-clamp-2 bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg border border-brand-100">{r.product?.name_ar || 'منتج محذوف'}</div>
                    </td>
                  )}
                  <td className="p-5 text-center align-top">
                    {r.approved ? (
                      <span className="inline-flex bg-success-50 text-success-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-success-200">الظهور مفعل</span>
                    ) : (
                      <span className="inline-flex bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-200">مخفي للتقييم</span>
                    )}
                  </td>
                  <td className="p-5 align-top">
                    <div className="flex items-center justify-center gap-2">
                      {!r.approved && (
                        <button onClick={() => handleApprove(r.id)} title="اعتماد التقييم ليظهر للزوار" className="w-9 h-9 flex items-center justify-center rounded-lg bg-success-50 text-success-600 hover:bg-success-600 hover:text-white transition-colors shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                      )}
                      <button onClick={() => handleDelete(r.id)} title="حذف التعليق نهائياً" className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
