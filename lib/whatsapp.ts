import { Order, Product } from '@/types';
import { WHATSAPP_TEMPLATE, WHATSAPP_QUICK_BUY_TEMPLATE } from './constants';

export function buildOrderMessage(order: Order): string {
  const paymentMethodLabel = order.payment_method === 'cash' ? 'الدفع عند الاستلام' : 
                             order.payment_method === 'instapay' ? 'إنستاباي' : 'فودافون كاش';
                             
  const notesSection = order.notes && order.notes.trim() !== '' ? `*ملاحظات:* ${order.notes}\n` : '';
  
  const itemsList = order.items.map(item => `- ${item.name_ar} (الكمية: ${item.quantity})`).join('\n');
  
  return WHATSAPP_TEMPLATE
    .replace('{order_number}', order.order_number)
    .replace('{customer_name}', order.customer_name)
    .replace('{phone}', order.phone)
    .replace('{governorate}', order.governorate)
    .replace('{city}', order.city)
    .replace('{address}', order.address)
    .replace('{payment_method}', paymentMethodLabel)
    .replace('{notes_section}', notesSection)
    .replace('{items_list}', itemsList)
    .replace('{subtotal}', order.subtotal.toString())
    .replace('{discount}', order.discount.toString())
    .replace('{total}', order.total.toString());
}

export function buildQuickBuyMessage(product: Product, variant?: string): string {
  const variantSection = variant ? `*النوع/المقاس:* ${variant}\n` : '';
  
  return WHATSAPP_QUICK_BUY_TEMPLATE
    .replace('{product_name}', product.name_ar)
    .replace('{price}', product.price.toString())
    .replace('{variant_section}', variantSection);
}

export function openWhatsApp(message: string): void {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  if (!cleanPhone) {
    console.warn('WhatsApp number is not configured in .env');
    return;
  }
  
  let finalPhone = cleanPhone;
  if (finalPhone.startsWith('01') && finalPhone.length === 11) {
    finalPhone = `2${finalPhone}`;
  }
  
  const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
