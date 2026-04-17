"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PaymentSelector } from './PaymentSelector';
import { createOrder, CheckoutFormData } from '@/lib/actions/createOrder';
import { buildOrderMessage, openWhatsApp } from '@/lib/whatsapp';
import { formatPrice, validateEgyptianPhone } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

const GOVERNORATES = [
  { value: '', label: 'اختر المحافظة' },
  { value: 'القاهرة', label: 'القاهرة' },
  { value: 'الجيزة', label: 'الجيزة' },
  { value: 'الإسكندرية', label: 'الإسكندرية' },
  { value: 'الدقهلية', label: 'الدقهلية' },
  { value: 'البحر الأحمر', label: 'البحر الأحمر' },
  { value: 'البحيرة', label: 'البحيرة' },
  { value: 'الفيوم', label: 'الفيوم' },
  { value: 'الغربية', label: 'الغربية' },
  { value: 'الإسماعيلية', label: 'الإسماعيلية' },
  { value: 'المنوفية', label: 'المنوفية' },
  { value: 'المنيا', label: 'المنيا' },
  { value: 'القليوبية', label: 'القليوبية' },
  { value: 'الوادي الجديد', label: 'الوادي الجديد' },
  { value: 'السويس', label: 'السويس' },
  { value: 'اسوان', label: 'اسوان' },
  { value: 'اسيوط', label: 'اسيوط' },
  { value: 'بني سويف', label: 'بني سويف' },
  { value: 'بورسعيد', label: 'بورسعيد' },
  { value: 'دمياط', label: 'دمياط' },
  { value: 'الشرقية', label: 'الشرقية' },
  { value: 'جنوب سيناء', label: 'جنوب سيناء' },
  { value: 'كفر الشيخ', label: 'كفر الشيخ' },
  { value: 'مطروح', label: 'مطروح' },
  { value: 'الأقصر', label: 'الأقصر' },
  { value: 'قنا', label: 'قنا' },
  { value: 'شمال سيناء', label: 'شمال سيناء' },
  { value: 'سوهاج', label: 'سوهاج' }
];

export function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();
  const items = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);
  const clearCart = useCartStore(state => state.clearCart);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CheckoutFormData, 'subtotal'>>({
    fullName: '',
    phone: '',
    governorate: '',
    city: '',
    address: '',
    paymentMethod: 'cash',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم مطلوب';
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!validateEgyptianPhone(formData.phone)) {
      newErrors.phone = 'رقم هاتف مصري غير صحيح';
    }
    if (!formData.governorate) newErrors.governorate = 'المحافظة مطلوبة';
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast("يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح", "error");
      return;
    }

    if (items.length === 0) {
      toast("سلتك فارغة", "error");
      return;
    }

    setIsSubmitting(true);
    
    const orderFormData: CheckoutFormData = {
      ...formData,
      subtotal: getTotal()
    };

    const result = await createOrder(orderFormData, items);

    if (result.success && result.order_number) {
      const orderStruct = {
        order_number: result.order_number,
        customer_name: formData.fullName,
        phone: formData.phone,
        governorate: formData.governorate,
        city: formData.city,
        address: formData.address,
        payment_method: formData.paymentMethod,
        notes: formData.notes || '',
        subtotal: getTotal(),
        discount: 0,
        total: getTotal(),
        items: items
      };

      const message = buildOrderMessage(orderStruct as any);
      
      // Track Analytics event matching GA4 recommended structure
      trackEvent('purchase', {
        transaction_id: result.order_number,
        value: getTotal(),
        currency: 'EGP',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name_ar,
          price: item.price,
          quantity: item.quantity
        }))
      });

      clearCart();
      openWhatsApp(message);
      router.push(`/confirmation?order=${result.order_number}`);
    } else {
      toast(result.error || "حدث خطأ أثناء تقديم الطلب", "error");
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6 pb-2 border-b border-border flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center tabular-nums text-sm">1</span>
            تفاصيل الشحن
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <Input 
              label="الاسم الكامل" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              error={errors.fullName}
              placeholder="الاسم الثلاثي"
            />
            <Input 
              label="رقم الهاتف" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              error={errors.phone}
              placeholder="مثال: 01012345678"
              type="tel"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <Select 
              label="المحافظة"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              error={errors.governorate}
              options={GOVERNORATES}
            />
            <Input 
              label="المدينة / المنطقة" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              error={errors.city}
              placeholder="مثال: مدينة نصر"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-text-main mb-1.5">العنوان بالتفصيل</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              dir="rtl"
              className={`w-full h-auto px-3 py-2 rounded-lg border bg-white text-sm text-text-main placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-brand-600 transition-colors resize-none ${errors.address ? 'border-red-500' : 'border-border'}`}
              placeholder="اسم الشارع، رقم العمارة، رقم الشقة، علامة مميزة"
            />
            {errors.address && <span className="text-sm text-red-500 mt-1">{errors.address}</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-1.5">ملاحظات إضافية (اختياري)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              dir="rtl"
              className="w-full h-auto px-3 py-2 rounded-lg border border-border bg-white text-sm text-text-main placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-brand-600 transition-colors resize-none"
              placeholder="أي ملاحظات إضافية بخصوص التوصيل أو الطلب..."
            />
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6 pb-2 border-b border-border flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center tabular-nums text-sm">2</span>
            طريقة الدفع
          </h2>
          <PaymentSelector value={formData.paymentMethod} onChange={handlePaymentChange} />
        </div>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sm:p-8 sticky top-24">
          <h2 className="text-xl font-bold text-text-main mb-6 pb-4 border-b border-border">ملخص الطلب</h2>
          
          <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm items-center">
                <span className="text-text-sec flex-1 pr-2 truncate">{item.name_ar} × {item.quantity}</span>
                <span className="tabular-nums font-bold text-text-main">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-bold text-xl text-text-main pt-6 border-t border-border border-dashed mb-8">
            <span>الإجمالي:</span>
            <span className="text-brand-600 tabular-nums">{formatPrice(getTotal())}</span>
          </div>

          <Button 
            type="submit"
            loading={isSubmitting}
            className="w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg h-14 text-base font-bold bg-brand-600 text-white rounded-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            تأكيد وإرسال الطلب عبر واتساب
          </Button>
          <p className="text-xs text-text-sec/80 font-medium text-center mt-4 leading-relaxed">
            سيتم تحويلك إلى واتساب تلقائياً لتأكيد طلبك مع خدمة العملاء
          </p>
        </div>
      </div>
    </form>
  );
}
