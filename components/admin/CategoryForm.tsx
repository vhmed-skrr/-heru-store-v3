"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ImageUploader } from './ImageUploader';
import { upsertCategory } from '@/lib/actions/adminCategories';

interface CategoryFormProps {
  initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name_ar: initialData?.name_ar || '',
    name_en: initialData?.name_en || '',
    color: initialData?.color || '#7c3aed',
    icon: initialData?.icon || '🛒',
    image: initialData?.image || '',
    order_index: initialData?.order_index?.toString() || '0',
    active: initialData !== undefined ? initialData.active : true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, image: urls[0] || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar.trim()) return toast("الاسم العربي مطلوب", "error");

    setIsSubmitting(true);

    const payload: Partial<Category> = {
      ...initialData,
      name_ar: formData.name_ar,
      name_en: formData.name_en || undefined,
      color: formData.color,
      icon: formData.icon,
      image: formData.image || undefined,
      order_index: parseInt(formData.order_index) || 0,
      active: formData.active
    };

    const { success, error } = await upsertCategory(payload);

    if (success) {
      toast("تم حفظ التصنيف بنجاح", "success");
      router.push('/admin/categories');
    } else {
      toast(`حدث خطأ: ${error}`, "error");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="الاسم (عربي) *" name="name_ar" value={formData.name_ar} onChange={handleChange} required />
        <Input label="الاسم (إنجليزي)" name="name_en" value={formData.name_en} onChange={handleChange} dir="ltr" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-main mb-1.5">اللون المميز</label>
          <div className="flex gap-2">
            <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-11 h-11 p-1 rounded cursor-pointer border border-border" />
            <Input name="color" value={formData.color} onChange={handleChange} dir="ltr" className="flex-1" />
          </div>
        </div>
        <Input label="أيقونة (إيموجي)" name="icon" value={formData.icon} onChange={handleChange} placeholder="مثال: 👟" />
        <Input label="ترتيب العرض" name="order_index" type="number" value={formData.order_index} onChange={handleChange} dir="ltr" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-main">صورة التصنيف (للعرض في الواجهة)</label>
        <ImageUploader value={formData.image ? [formData.image] : []} onChange={handleImageChange} maxImages={1} bucket="category-images" />
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-600" />
          <span className="font-medium text-text-main">تصنيف نشط</span>
        </label>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button type="submit" loading={isSubmitting} size="lg" className="px-10">حفظ التصنيف</Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} size="lg">إلغاء</Button>
      </div>
    </form>
  );
}
