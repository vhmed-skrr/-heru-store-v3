"use client";

/**
 * Admin Settings Page
 *
 * The `settings` table uses a KEY-VALUE schema:
 *   (id UUID, key TEXT UNIQUE, value JSONB, created_at)
 *
 * LOADING — CORRECT CODE:
 *   supabase.from('settings').select('key, value')
 *   → Returns all rows, then we convert [{key,value}] → flat object
 *
 * SAVING — handled by adminSettings.ts which converts the flat formData
 *   object back into key-value rows and upserts with onConflict:'key'.
 *
 * Hero Cards section added in v2 — supports:
 *   hero_main_image, hero_card1_*, hero_card2_*
 */

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { saveSettings } from '@/lib/actions/adminSettings';
import { Setting } from '@/types';

interface SettingsFormData {
  store_name:           string;
  whatsapp:             string;
  hero_title:           string;
  hero_subtitle:        string;
  hero_cta_primary:     string;
  hero_cta_secondary:   string;
  // ── Hero Cards (v2) ─────────────────────────────────────
  hero_main_image:      string;
  hero_card1_title:     string;
  hero_card1_subtitle:  string;
  hero_card1_image:     string;
  hero_card1_bg:        string;
  hero_card1_link:      string;
  hero_card2_title:     string;
  hero_card2_subtitle:  string;
  hero_card2_image:     string;
  hero_card2_bg:        string;
  hero_card2_link:      string;
  // ─────────────────────────────────────────────────────────
  announcement_active:  boolean;
  announcement_items:   string[];
  footer_tagline:       string;
  footer_support_hours: string;
  social_instagram:     string;
  social_facebook:      string;
  social_tiktok:        string;
  social_telegram:      string;
  logo_type:            string;
  logo_value:           string;
  logo_height:          number;
  store_accent_color:   string;
}

const DEFAULT_FORM: SettingsFormData = {
  store_name:           '',
  whatsapp:             '',
  hero_title:           '',
  hero_subtitle:        '',
  hero_cta_primary:     '',
  hero_cta_secondary:   '',
  hero_main_image:      '',
  hero_card1_title:     '',
  hero_card1_subtitle:  '',
  hero_card1_image:     '',
  hero_card1_bg:        '#7c3aed',
  hero_card1_link:      '/shop',
  hero_card2_title:     '',
  hero_card2_subtitle:  '',
  hero_card2_image:     '',
  hero_card2_bg:        '#6d28d9',
  hero_card2_link:      '/shop',
  announcement_active:  false,
  announcement_items:   [],
  footer_tagline:       '',
  footer_support_hours: '',
  social_instagram:     '',
  social_facebook:      '',
  social_tiktok:        '',
  social_telegram:      '',
  logo_type:            'text',
  logo_value:           '',
  logo_height:          40,
  store_accent_color:   '#7c3aed',
};

// ── Section wrapper ─────────────────────────────────────────
function Section({
  title,
  icon,
  children,
  fullWidth,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-5 h-max${fullWidth ? ' lg:col-span-2' : ''}`}>
      <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
        <span className="text-brand-600">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── URL input with image preview ────────────────────────────
function ImageUrlField({
  label,
  name,
  value,
  onChange,
  placeholder = 'https://...',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Input label={label} name={name} value={value} onChange={onChange} dir="ltr" placeholder={placeholder} />
      {value && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const { toast }               = useToast();
  const [formData, setFormData] = useState<SettingsFormData>(DEFAULT_FORM);
  const [announcementInput, setAnnouncementInput] = useState('');

  const supabaseRef = useRef(createClient());

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabaseRef.current
        .from('settings')
        .select('key, value');

      if (error) {
        console.error('[Settings] load error:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const map: Record<string, unknown> = {};
        for (const row of data as Setting[]) {
          map[row.key] = row.value;
        }

        setFormData(prev => {
          const next = { ...prev };

          // String fields
          const strKeys: (keyof SettingsFormData)[] = [
            'store_name', 'whatsapp',
            'hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary',
            'hero_main_image',
            'hero_card1_title', 'hero_card1_subtitle', 'hero_card1_image', 'hero_card1_bg', 'hero_card1_link',
            'hero_card2_title', 'hero_card2_subtitle', 'hero_card2_image', 'hero_card2_bg', 'hero_card2_link',
            'footer_tagline', 'footer_support_hours',
            'social_instagram', 'social_facebook', 'social_tiktok', 'social_telegram',
            'logo_type', 'logo_value', 'store_accent_color',
          ];
          for (const k of strKeys) {
            if (typeof map[k] === 'string') (next as any)[k] = map[k];
          }

          if (typeof map.announcement_active === 'boolean') next.announcement_active = map.announcement_active;
          if (typeof map.logo_height === 'number')          next.logo_height          = map.logo_height;
          if (Array.isArray(map.announcement_items))        next.announcement_items   = map.announcement_items as string[];

          return next;
        });
      }

      setLoading(false);
    }

    loadSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAnnouncement = () => {
    if (announcementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        announcement_items: [...prev.announcement_items, announcementInput.trim()],
      }));
      setAnnouncementInput('');
    }
  };

  const handleRemoveAnnouncement = (index: number) => {
    const newItems = [...formData.announcement_items];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, announcement_items: newItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { success, error } = await saveSettings(formData as unknown as Record<string, unknown>);
    if (success) {
      toast('تم حفظ الإعدادات ويسري تفعيلها مباشرة', 'success');
    } else {
      toast(`فشل الحفظ: ${error}`, 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto" />
      </div>
    );
  }

  /* ── Icons ── */
  const IconInfo   = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
  const IconLayout = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
  const IconImage  = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  const IconBell   = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
  const IconLink   = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header */}
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

        {/* ── المعلومات الأساسية ──────────────────────────── */}
        <Section title="المعلومات الأساسية" icon={IconInfo}>
          <Input label="اسم المتجر *" name="store_name" value={formData.store_name} onChange={handleChange} required />
          <Input label="رقم هاتف الواتساب *" name="whatsapp" value={formData.whatsapp} onChange={handleChange} dir="ltr" placeholder="201xxxxxxxxx" required />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">نوع واجهة الشعار (Logo)</label>
            <select name="logo_type" value={formData.logo_type} onChange={handleChange} className="h-11 px-3 rounded-lg border border-border bg-bg-secondary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-600">
              <option value="text">نص مباشر</option>
              <option value="image">صورة (إدراج رابط مباشر URL)</option>
            </select>
          </div>
          <Input
            label={formData.logo_type === 'text' ? 'النص المعروض' : 'الرابط المباشر للصورة'}
            name="logo_value"
            value={formData.logo_value}
            onChange={handleChange}
            dir={formData.logo_type === 'image' ? 'ltr' : 'rtl'}
          />
          {formData.logo_type === 'image' && (
            <Input label="ارتفاع الصورة (بالبيكسل px)" name="logo_height" type="number" value={formData.logo_height} onChange={handleChange} dir="ltr" />
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main">اللون المميز للمتجر (Accent Color)</label>
            <div className="flex items-center gap-3">
              <input type="color" name="store_accent_color" value={formData.store_accent_color} onChange={handleChange} className="w-12 h-12 p-0 border-0 rounded cursor-pointer shadow-sm" />
              <Input name="store_accent_color" value={formData.store_accent_color} onChange={handleChange} dir="ltr" className="flex-1 font-mono uppercase" />
            </div>
          </div>
        </Section>

        {/* ── نصوص الواجهة الرئيسية ───────────────────────── */}
        <Section title="نصوص واجهة المتجر (الرئيسية)" icon={IconLayout}>
          <Input label="العنوان التسويقي الرئيسي" name="hero_title" value={formData.hero_title} onChange={handleChange} />
          <Input label="النص الفرعي للرسالة التعريفية" name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} />
          <Input label="كلمة الزر الأساسي الموجه للشراء" name="hero_cta_primary" value={formData.hero_cta_primary} onChange={handleChange} placeholder="مثال: تسوق الآن" />
          <Input label="كلمة الزر الثانوي المجاور (اختياري)" name="hero_cta_secondary" value={formData.hero_cta_secondary} onChange={handleChange} placeholder="مثال: اقترح تصميم" />
        </Section>

        {/* ── بطاقات الـ Hero (v2) ─────────────────────────── */}
        <Section title="بطاقات الـ Hero وصورة المنتج الرئيسية" icon={IconImage} fullWidth>
          {/* Main hero image */}
          <div className="pb-5 mb-5 border-b border-border">
            <h3 className="text-sm font-black text-text-main mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-black">✦</span>
              الصورة الرئيسية للـ Hero (المنتج / الغلاف)
            </h3>
            <ImageUrlField
              label="رابط صورة المنتج الرئيسية"
              name="hero_main_image"
              value={formData.hero_main_image}
              onChange={handleChange}
              placeholder="https://... رابط الصورة"
            />
            <p className="text-xs text-text-sec mt-2">اتركه فارغاً لعرض تصميم gradient بنفسجي تلقائياً</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Card 1 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-black" style={{ backgroundColor: formData.hero_card1_bg }}>1</span>
                البطاقة الأولى
              </h3>
              <Input label="عنوان البطاقة الأولى" name="hero_card1_title" value={formData.hero_card1_title} onChange={handleChange} placeholder="مثال: تصاميم مميزة" />
              <Input label="نص صغير" name="hero_card1_subtitle" value={formData.hero_card1_subtitle} onChange={handleChange} placeholder="مثال: جودة عالية" />
              <ImageUrlField
                label="رابط صورة البطاقة الأولى"
                name="hero_card1_image"
                value={formData.hero_card1_image}
                onChange={handleChange}
              />
              <Input label="رابط الزر (href)" name="hero_card1_link" value={formData.hero_card1_link} onChange={handleChange} dir="ltr" placeholder="/shop" />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-main">لون خلفية البطاقة الأولى</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="hero_card1_bg"
                    value={formData.hero_card1_bg}
                    onChange={handleChange}
                    className="w-10 h-10 p-0 border-0 rounded cursor-pointer shadow-sm"
                  />
                  <Input name="hero_card1_bg" value={formData.hero_card1_bg} onChange={handleChange} dir="ltr" className="flex-1 font-mono uppercase" />
                </div>
                {/* Preview */}
                <div
                  className="w-full h-10 rounded-lg border border-border flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: formData.hero_card1_bg }}
                >
                  {formData.hero_card1_title || 'معاينة البطاقة'}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-black" style={{ backgroundColor: formData.hero_card2_bg }}>2</span>
                البطاقة الثانية
              </h3>
              <Input label="عنوان البطاقة الثانية" name="hero_card2_title" value={formData.hero_card2_title} onChange={handleChange} placeholder="مثال: عروض حصرية" />
              <Input label="نص صغير" name="hero_card2_subtitle" value={formData.hero_card2_subtitle} onChange={handleChange} placeholder="مثال: خصومات يومية" />
              <ImageUrlField
                label="رابط صورة البطاقة الثانية"
                name="hero_card2_image"
                value={formData.hero_card2_image}
                onChange={handleChange}
              />
              <Input label="رابط الزر (href)" name="hero_card2_link" value={formData.hero_card2_link} onChange={handleChange} dir="ltr" placeholder="/shop" />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-main">لون خلفية البطاقة الثانية</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="hero_card2_bg"
                    value={formData.hero_card2_bg}
                    onChange={handleChange}
                    className="w-10 h-10 p-0 border-0 rounded cursor-pointer shadow-sm"
                  />
                  <Input name="hero_card2_bg" value={formData.hero_card2_bg} onChange={handleChange} dir="ltr" className="flex-1 font-mono uppercase" />
                </div>
                <div
                  className="w-full h-10 rounded-lg border border-border flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: formData.hero_card2_bg }}
                >
                  {formData.hero_card2_title || 'معاينة البطاقة'}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── شريط العروض ───────────────────────────────────── */}
        <Section title="شريط العروض الجوال (Announcement Bar)" icon={IconBell} fullWidth>
          <label className="flex items-center gap-3 cursor-pointer bg-brand-50 p-3 rounded-lg border border-brand-100 w-max">
            <input
              type="checkbox"
              name="announcement_active"
              checked={formData.announcement_active}
              onChange={handleChange}
              className="w-5 h-5 text-brand-600 rounded"
            />
            <span className="font-bold text-sm text-brand-700">تفعيل ظهور شريط الإعلانات أعلى كل الصفحات؟</span>
          </label>
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-text-main">قائمة الإعلانات المتحركة بالتناوب</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                name="announcementInput"
                value={announcementInput}
                onChange={(e) => setAnnouncementInput(e.target.value)}
                placeholder="مثال: استخدم كوبون NEW50 للحصول على خصم ضخم الآن"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddAnnouncement} className="shrink-0 sm:mt-6">إضافة للقائمة</Button>
            </div>
            {formData.announcement_items.length > 0 ? (
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.announcement_items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-bg-secondary p-3 rounded-lg border border-border text-sm font-medium shadow-sm">
                    <span className="truncate pr-1">{item}</span>
                    <button type="button" onClick={() => handleRemoveAnnouncement(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold p-1 rounded-md shrink-0 transition-colors">&times;</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 p-4 bg-bg-secondary text-center text-text-sec text-sm rounded-lg border border-dashed border-border">
                لا توجد إعلانات نشطة. سيتم إخفاء الشريط إذا كانت هذه القائمة فارغة.
              </div>
            )}
          </div>
        </Section>

        {/* ── Footer وروابط التواصل ──────────────────────────── */}
        <Section title="التذييل (Footer) وروابط وسائل التواصل" icon={IconLink} fullWidth>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <Input label="نبذة موجزة تُعرض في أسفل المتجر (Tagline)" name="footer_tagline" value={formData.footer_tagline} onChange={handleChange} />
            <Input label="معلومات ساعات عمل خدمة الرد (Support Hours)" name="footer_support_hours" value={formData.footer_support_hours} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6 bg-bg-secondary p-5 rounded-xl border border-border">
            <Input label="رابط حساب انستجرام"      name="social_instagram" value={formData.social_instagram} onChange={handleChange} dir="ltr" placeholder="https://instagram.com/..." />
            <Input label="رابط صفحة فيسبوك"         name="social_facebook"  value={formData.social_facebook}  onChange={handleChange} dir="ltr" placeholder="https://facebook.com/..." />
            <Input label="رابط حساب تيك توك"        name="social_tiktok"    value={formData.social_tiktok}    onChange={handleChange} dir="ltr" placeholder="https://tiktok.com/@..." />
            <Input label="رابط قناة / حساب تليجرام" name="social_telegram"  value={formData.social_telegram}  onChange={handleChange} dir="ltr" placeholder="https://t.me/..." />
          </div>
        </Section>
      </div>
    </form>
  );
}
