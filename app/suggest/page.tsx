"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { submitSuggestion } from '@/lib/actions/submitSuggestion';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function SuggestPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.description) {
      return toast("يرجى إكمال البيانات الأساسية أولاً", "error");
    }

    setLoading(true);
    const { success, error } = await submitSuggestion(formData);
    setLoading(false);

    if (success) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast(`حدث خطأ أثناء الإرسال: ${error}`, "error");
    }
  };

  const handleImageChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, image_url: urls[0] || '' }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 w-full">
        <div className="bg-white p-8 md:p-14 rounded-3xl border border-border shadow-sm text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-success-50 text-success-500 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h1 className="text-3xl font-black font-arabic text-text-main mb-4">شكراً لإسهامك معنا!</h1>
          <p className="text-text-sec font-medium leading-relaxed mb-8 max-w-sm">
            تم استلام اقتراحك بنجاح. سيقوم فريق التصميم والابتكار في Heru بمراجعة فكرتك، وسنتواصل معك قريباً جداً في حال اعتمادها.
          </p>
          <Button onClick={() => window.location.href = '/'} size="lg" className="px-8 shadow-md">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black font-arabic text-text-main mb-4">اقترح تصميمك</h1>
        <p className="text-text-sec text-lg font-medium max-w-xl mx-auto">
          لديك فكرة تصميم عبقرية لتيشيرت أو سويت شيرت وتود رؤيتها مطروحة في الأسواق؟ شاركنا تفاصيلها وسنتولى تحقيق الحلم الإبداعي معاً!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl border border-border flex flex-col gap-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="اسمك الكامل *" 
            placeholder="مثال: يوسف محمد" 
            value={formData.name} 
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="h-12"
          />
          <Input 
            label="رقم الهاتف (الواتساب) *" 
            placeholder="للتواصل معك ومناقشة الفكرة" 
            value={formData.phone} 
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            dir="ltr"
            className="h-12 text-center md:text-left"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-bold text-text-main">
            وصف الفكرة التصميمية بدقة *
          </label>
          <textarea 
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition-all text-sm font-medium resize-none leading-relaxed placeholder:text-text-sec/60"
            placeholder="اشرح لنا الفكرة بالتفصيل... هل هي نمط (Pattern) عصري؟ جملة تعبيرية؟ أم رسم جرافيك؟ وما هو الشعور الذي يجب أن ينقله التصميم؟"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div className="flex flex-col gap-2.5 bg-bg-secondary p-5 md:p-6 rounded-2xl border border-border border-dashed">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <label className="text-sm font-bold text-text-main">
              إرفاق صورة ملهمة للتصميم (اختياري)
            </label>
          </div>
          <p className="text-xs text-text-sec font-medium mb-3">
            إذا كان لديك اسكتش مبدئي أو صورة قريبة لفكرتك، رفعها هنا سيساعدنا على التخيل بشكل أسرع.
          </p>
          <ImageUploader 
            value={formData.image_url ? [formData.image_url] : []} 
            onChange={handleImageChange} 
            maxImages={1} 
            bucket="suggestions" // We assume a 'suggestions' bucket can be created or this defaults
          />
        </div>

        <Button 
          type="submit" 
          loading={loading}
          className="h-14 font-bold text-lg mt-2 shadow-md hover:shadow-lg transition-all"
        >
          إرسال الاقتراح الآن
        </Button>
      </form>
    </div>
  );
}
