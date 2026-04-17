"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ImageUploader } from './ImageUploader';
import { upsertProduct } from '@/lib/actions/adminProducts';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name_ar: initialData?.name_ar || '',
    name_en: initialData?.name_en || '',
    description_ar: initialData?.description_ar || '',
    price: initialData?.price?.toString() || '',
    original_price: initialData?.original_price?.toString() || '',
    stock: initialData?.stock?.toString() || '0',
    category_id: typeof initialData?.category_id === 'object' ? (initialData.category_id as any).id : (initialData?.category_id || ''),
    featured: initialData?.featured || false,
    active: initialData !== undefined ? initialData.active : true,
    is_new: initialData?.is_new || false,
    images: initialData?.images || []
  });

  const categoryOptions = [
    { value: '', label: 'اختر تصنيفاً' },
    ...categories.map(c => ({ value: c.id, label: c.name_ar }))
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ar.trim()) return toast("الاسم العربي مطلوب", "error");
    if (!formData.price || Number(formData.price) <= 0) return toast("السعر غير صحيح", "error");
    if (!formData.category_id) return toast("التصنيف مطلوب", "error");
    if (formData.images.length === 0) return toast("يجب رفع صورة واحدة على الأقل", "error");

    setIsSubmitting(true);

    const price = parseFloat(formData.price);
    const original_price = formData.original_price ? parseFloat(formData.original_price) : undefined;
    const stock = parseInt(formData.stock) || 0;

    const payload: Partial<Product> = {
      ...initialData,
      name_ar: formData.name_ar,
      name_en: formData.name_en || undefined,
      description_ar: formData.description_ar,
      price,
      original_price: original_price && original_price > price ? original_price : undefined,
      stock,
      category_id: formData.category_id,
      featured: formData.featured,
      active: formData.active,
      is_new: formData.is_new,
      images: formData.images
    };

    const { success, error } = await upsertProduct(payload);

    if (success) {
      toast("تم حفظ المنتج بنجاح", "success");
      router.push('/admin/products');
    } else {
      toast(`حدث خطأ: ${error}`, "error");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="اسم المنتج (عربي) *" 
          name="name_ar" 
          value={formData.name_ar} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="اسم المنتج (إنجليزي)" 
          name="name_en" 
          value={formData.name_en} 
          onChange={handleChange} 
          dir="ltr"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text-main">الوصف التفصيلي (عربي)</label>
        <textarea
          name="description_ar"
          value={formData.description_ar}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input 
          label="السعر الحالي *" 
          name="price" 
          type="number"
          min="1"
          step="0.01"
          value={formData.price} 
          onChange={handleChange} 
          required 
          dir="ltr"
        />
        <Input 
          label="السعر قبل الخصم" 
          name="original_price" 
          type="number"
          min="1"
          step="0.01"
          value={formData.original_price} 
          onChange={handleChange} 
          dir="ltr"
        />
        <Input 
          label="الكمية في المخزون *" 
          name="stock" 
          type="number"
          min="0"
          value={formData.stock} 
          onChange={handleChange} 
          required 
          dir="ltr"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select 
          label="التصنيف *"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          options={categoryOptions}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text-main">صور المنتج (حد أقصى 9، يرجى اختيار صور جذابة)</label>
        <ImageUploader value={formData.images} onChange={handleImagesChange} maxImages={9} bucket="product-images" />
      </div>

      <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-600" />
          <span className="font-medium text-text-main">منتج نشط (مرئي للعملاء)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-600" />
          <span className="font-medium text-text-main">مميز (يظهر بالرئيسية)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-600" />
          <span className="font-medium text-text-main">علامة "جديد"</span>
        </label>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button type="submit" loading={isSubmitting} size="lg" className="px-10">
          حفظ المنتج
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} size="lg">
          إلغاء
        </Button>
      </div>
    </form>
  );
}
