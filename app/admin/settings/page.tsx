"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { saveSettings } from '@/lib/actions/adminSettings';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<any>({
    store_name: '',
    whatsapp: '',
    hero_title: '',
    hero_subtitle: '',
    hero_cta_primary: '',
    hero_cta_secondary: '',
    announcement_active: false,
    announcement_items: [],
    footer_tagline: '',
    footer_support_hours: '',
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    social_telegram: '',
    logo_type: 'text',
    logo_value: '',
    logo_height: 40,
    store_accent_color: '#7c3aed'
  });

  const [announcementInput, setAnnouncementInput] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setFormData((prev: any) => ({ ...prev, ...data }));
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAnnouncement = () => {
    if (announcementInput.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        announcement_items: [...(prev.announcement_items || []), announcementInput.trim()]
      }));
      setAnnouncementInput('');
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    const newItems = [...(formData.announcement_items || [])];
    newItems.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, announcement_items: newItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { success, error } = await saveSettings(formData);
    
    if (success) {
      toast("تم حفظ الإعدادات ويسري تفعيلها مباشرة", "success");
    } else {
      toast(`فشل الحفظ: ${error}`, "error");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-16 text-center"><div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto"></div></div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إعدادات المتجر العامة</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">التحكم في المظهر، الألوان، والنصوص الأساسية للمتجر</p>
        </div>
        <Button type="submit" loading={saving} size="lg" className="px-8 shadow-md hover:shadow-lg">
          حفظ كل التغييرات
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-5 h-max">
          <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            المعلومات الأساسية
          </h2>
          <Input label="اسم المتجر *" name="store_name" value={formData.store_name} onChange={handleChange} required />
          <Input label="رقم هاتف الواتساب *" name="whatsapp" value={formData.whatsapp} onChange={handleChange} dir="ltr" placeholder="201xxxxxxxxx" required />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">نوع واجهة الشعار (Logo)</label>
            <select name="logo_type" value={formData.logo_type} onChange={handleChange} className="h-11 px-3 rounded-lg border border-border bg-bg-secondary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-600">
              <option value="text">نص مباشر</option>
              <option value="image">صورة (إدراج رابط مباشر URL)</option>
            </select>
          </div>
          <Input label={formData.logo_type === 'text' ? "النص المعروض" : "الرابط المباشر للصورة"} name="logo_value" value={formData.logo_value} onChange={handleChange} dir={formData.logo_type === 'image' ? 'ltr' : 'rtl'} />
          {formData.logo_type === 'image' && (
            <Input label="ارتفاع الصورة للضبط (بالبيكسل px)" name="logo_height" type="number" value={formData.logo_height} onChange={handleChange} dir="ltr" />
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">اللون المميز للمتجر (Accent Color)</label>
            <div className="flex items-center gap-3">
              <input type="color" name="store_accent_color" value={formData.store_accent_color} onChange={handleChange} className="w-12 h-12 p-0 border-0 rounded cursor-pointer shadow-sm" />
              <Input name="store_accent_color" value={formData.store_accent_color} onChange={handleChange} dir="ltr" className="flex-1 font-mono uppercase" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-5 h-max">
          <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            نصوص واجهة المتجر (الرئيسية)
          </h2>
          <Input label="العنوان التسويقي الرئيسي" name="hero_title" value={formData.hero_title} onChange={handleChange} />
          <Input label="النص الفرعي للرسالة التعريفية" name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} />
          <Input label="كلمة الزر الأساسي الموجه للشراء" name="hero_cta_primary" value={formData.hero_cta_primary} onChange={handleChange} placeholder="مثال: تسوق الآن" />
          <Input label="كلمة الزر الثانوي المجاور (اختياري)" name="hero_cta_secondary" value={formData.hero_cta_secondary} onChange={handleChange} placeholder="مثال: اقترح تصميم" />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-5 h-max lg:col-span-2">
          <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            شريط العروض الجوال (Announcement Bar)
          </h2>
          <label className="flex items-center gap-3 cursor-pointer bg-brand-50 p-3 rounded-lg border border-brand-100 w-max">
            <input type="checkbox" name="announcement_active" checked={formData.announcement_active} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded" />
            <span className="font-bold text-sm text-brand-700">تفعيل ظهور شريط الإعلانات أعلى كل الصفحات؟</span>
          </label>
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-text-main">قائمة الإعلانات المتحركة بالتناوب</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input name="announcementInput" value={announcementInput} onChange={(e) => setAnnouncementInput(e.target.value)} placeholder="مثال: استخدم كوبون NEW50 للحصول على خصم ضخم الآن" className="flex-1" />
              <Button type="button" onClick={handleAddAnnouncement} className="shrink-0 sm:mt-6">إضافة للقائمة</Button>
            </div>
            {formData.announcement_items?.length > 0 ? (
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.announcement_items.map((item: string, idx: number) => (
                  <li key={idx} className="flex justify-between items-center bg-bg-secondary p-3 rounded-lg border border-border text-sm font-medium shadow-sm">
                    <span className="truncate pr-1">{item}</span>
                    <button type="button" onClick={() => handleRemoveAnnouncement(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold p-1 rounded-md shrink-0 transition-colors">&times;</button>
                  </li>
                ))}
              </ul>
            ) : (
             <div className="mt-3 p-4 bg-bg-secondary text-center text-text-sec text-sm rounded-lg border border-dashed border-border">لا توجد إعلانات نشطة. سيتم إخفاء الشريط إذا كانت هذه القائمة فارغة.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-5 h-max lg:col-span-2">
          <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            التذييل (Footer) وروابط وسائل التواصل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <Input label="نبذة موجزة تُعرض في أسفل المتجر (Tagline)" name="footer_tagline" value={formData.footer_tagline} onChange={handleChange} />
            <Input label="معلومات ساعات عمل خدمة الرد (Support Hours)" name="footer_support_hours" value={formData.footer_support_hours} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6 bg-bg-secondary p-5 rounded-xl border border-border">
            <Input label="رابط حساب انستجرام" name="social_instagram" value={formData.social_instagram} onChange={handleChange} dir="ltr" placeholder="https://instagram.com/..." />
            <Input label="رابط صفحة فيسبوك" name="social_facebook" value={formData.social_facebook} onChange={handleChange} dir="ltr" placeholder="https://facebook.com/..." />
            <Input label="رابط حساب تيك توك" name="social_tiktok" value={formData.social_tiktok} onChange={handleChange} dir="ltr" placeholder="https://tiktok.com/@..." />
            <Input label="رابط قناة / حساب تليجرام" name="social_telegram" value={formData.social_telegram} onChange={handleChange} dir="ltr" placeholder="https://t.me/..." />
          </div>
        </div>
      </div>
    </form>
  );
}
