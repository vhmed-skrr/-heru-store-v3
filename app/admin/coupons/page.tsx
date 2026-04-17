"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { addCoupon, toggleCouponActive, deleteCoupon } from '@/lib/actions/adminCoupons';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    code: '', type: 'percentage', value: '', min_order: '', max_uses: '', expires_at: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) return toast("يرجى إكمال البيانات المطلوبة", "error");
    setIsSubmitting(true);
    const { success, error } = await addCoupon(formData);
    if (success) {
      toast("تم إضافة الكوبون بنجاح", "success");
      setFormData({ code: '', type: 'percentage', value: '', min_order: '', max_uses: '', expires_at: '' });
      fetchCoupons();
    } else {
      toast(error || "حدث خطأ", "error");
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await toggleCouponActive(id, active);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ملاحظة هامة: هل أنت متأكد من حذف هذا الكوبون نهائياً؟")) {
      await deleteCoupon(id);
      fetchCoupons();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إدارة الكوبونات</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">إضافة والتحكم في كوبونات خصم المبيعات وقواعدها</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-5 self-start h-max">
          <h2 className="font-bold text-lg border-b border-border pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            إضافة كوبون جديد
          </h2>
          <Input label="كود الكوبون *" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} dir="ltr" required placeholder="مثال: HERU50" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">نوع الخصم المستهدف</label>
            <select className="h-11 px-3 border border-border rounded-lg bg-bg-secondary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-600 cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="percentage">نسبة مئوية من الإجمالي (%)</option>
              <option value="fixed">قيمة ثابتة مخصومة (ج.م)</option>
            </select>
          </div>
          <Input label="القيمة المخصومة *" type="number" min="1" step="0.01" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} dir="ltr" required />
          <div className="w-full h-px bg-border my-1"></div>
          <Input label="الحد الأدنى للطلب (اختياري)" type="number" min="0" value={formData.min_order} onChange={e => setFormData({...formData, min_order: e.target.value})} dir="ltr" />
          <Input label="الحد الأقصى لمرات الاستخدام" type="number" min="1" value={formData.max_uses} onChange={e => setFormData({...formData, max_uses: e.target.value})} dir="ltr" placeholder="تُترك فارغة للاستخدام المفتوح" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">تاريخ الإنتهاء (اختياري)</label>
            <input type="date" className="h-11 px-3 border border-border rounded-lg bg-bg-secondary focus:outline-none font-sans text-sm" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} dir="ltr" />
          </div>
          <Button type="submit" loading={isSubmitting} className="mt-4 w-full shadow-md py-3 font-bold text-base">إصدار الكوبون</Button>
        </form>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-border shadow-sm overflow-hidden h-max">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse whitespace-nowrap">
              <thead className="bg-bg-secondary border-b border-border text-xs font-bold text-text-sec tracking-wide">
                <tr>
                  <th className="p-4">اسم الكود</th>
                  <th className="p-4">مقدار الخصم</th>
                  <th className="p-4">الحد الأدنى</th>
                  <th className="p-4 text-center">مرات الاستخدام</th>
                  <th className="p-4 text-center">انتهاء الصلاحية</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-16 text-center"><div className="animate-spin w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 mx-auto"></div></td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan={7} className="p-16 text-center text-text-sec font-medium text-lg border-t border-border border-dashed">لم يتم تسجيل أي كوبونات مسبقاً</td></tr>
                ) : coupons.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-bg-secondary/40 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">{c.code}</span>
                    </td>
                    <td className="p-4 font-black text-text-main text-lg" dir="ltr">{c.value}{c.type === 'percentage' ? '%' : ' ج.م'}</td>
                    <td className="p-4 text-sm font-medium text-text-sec">{c.min_order > 0 ? c.min_order + ' ج.م' : 'بدون'}</td>
                    <td className="p-4 text-center text-sm font-bold">
                      <span className="bg-bg-secondary px-3 py-1.5 rounded-md border border-border shadow-sm">
                        <span className="text-text-main pr-1">{c.uses}</span>
                         من 
                        <span className="text-text-sec pl-1">{c.max_uses || '∞'}</span>
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {c.expires_at ? (
                        <span className="text-xs font-bold text-text-sec bg-white border border-border px-2 py-1 rounded" dir="ltr">{new Date(c.expires_at).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-xs font-bold text-success-600 bg-success-50 px-2 py-1 rounded">غير محدد</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleToggle(c.id, c.active)} title="تفعيل / تعطيل الكوبون" className={`w-12 h-6 rounded-full relative transition-colors shadow-inner inline-flex items-center ${c.active ? 'bg-success-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all duration-300 ${c.active ? 'right-1' : 'right-[calc(100%-1.25rem)]'}`} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(c.id)} title="حذف الكوبون نهائياً" className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors m-auto flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
