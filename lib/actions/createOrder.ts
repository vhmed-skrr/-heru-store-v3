"use server";

import { createClient } from '@supabase/supabase-js';
import { validateEgyptianPhone, sanitizeInput } from '@/lib/utils';
import { sendOrderConfirmation } from '@/lib/email';
import { CartItem } from '@/store/cart';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  paymentMethod: string;
  notes?: string;
  subtotal: number;
}

export async function createOrder(
  formData: CheckoutFormData, 
  cartItems: CartItem[]
) {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'السلة فارغة' };
    }

    if (!validateEgyptianPhone(formData.phone)) {
      return { success: false, error: 'رقم الهاتف غير صحيح. الرجاء إدخال رقم هاتف مصري صحيح (مثال: 01012345678)' };
    }

    // Server-side validation & Sanitization
    const sFullName = sanitizeInput(formData.fullName, 100);
    const sAddress = sanitizeInput(formData.address, 500);
    const sNotes = sanitizeInput(formData.notes || "", 500);
    const sGovernorate = sanitizeInput(formData.governorate, 100);
    const sCity = sanitizeInput(formData.city, 100);
    const sPaymentMethod = sanitizeInput(formData.paymentMethod, 50);

    if (sFullName.length < 2) {
      return { success: false, error: 'الاسم يجب أن يحتوي على حرفين على الأقل' };
    }
    if (sAddress.length < 10) {
      return { success: false, error: 'العنوان التفصيلي يجب أن يكون 10 أحرف أو أكثر لتسهيل التوصيل' };
    }

    // Initialize Supabase admin client
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Unable to create order server-side.");
      return { success: false, error: 'خطأ بخادم المتجر. يرجى مراجعة المسؤول.' };
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const subtotal = formData.subtotal;
    const discount = 0; 
    const total = subtotal - discount;

    const orderData = {
      customer_name: sFullName,
      phone: formData.phone, // already strictly validated by regex
      governorate: sGovernorate,
      city: sCity,
      address: sAddress,
      payment_method: sPaymentMethod,
      notes: sNotes,
      subtotal,
      discount,
      total,
      status: 'pending'
    };

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return { success: false, error: 'حدث خطأ أثناء إتمام الطلب الرئيسي' };
    }

    const orderItemsData = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name_ar: item.name_ar,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      return { success: false, error: 'حدث خطأ أثناء معالجة عناصر الطلب لكن تم تسجيل الرئيسي' };
    }

    // Fire-and-forget Email Notification
    sendOrderConfirmation({
      order_number: order.order_number,
      customer_name: sFullName,
      phone: formData.phone,
      total: total,
      payment_method: sPaymentMethod,
      items: orderItemsData
    }).catch(e => console.error("Email error:", e));

    return { 
      success: true, 
      order_number: order.order_number 
    };
  } catch (error: any) {
    console.error('Unexpected error during order creation:', error);
    return { success: false, error: 'حدث خطأ غير متوقع أثناء معالجة الطلب' };
  }
}
