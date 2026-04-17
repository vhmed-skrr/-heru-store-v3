import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (*)
      ),
      order_status_history (
        *
      )
    `)
    .eq('id', params.id)
    .single();

  if (!order) {
    notFound();
  }

  const paymentMethods: Record<string, string> = {
    cash: 'الدفع عند الاستلام',
    instapay: 'إنستاباي',
    vodafone_cash: 'فودافون كاش'
  };

  const whatsappPhone = order.phone.replace(/[^0-9]/g, '');

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm mb-2">
        <Link href="/admin/orders" className="font-bold text-text-sec hover:text-brand-600 transition-colors flex items-center gap-1.5 bg-white px-4 py-2 rounded-lg border border-border shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          تصفح قائمة الطلبات
        </Link>
        <a 
          href={`https://wa.me/2${whatsappPhone}?text=مرحباً ${order.customer_name}، نتواصل معك من متجر ${process.env.NEXT_PUBLIC_STORE_NAME || 'Heru'} بخصوص طلبك رقم ${order.order_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 shrink-0 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors shadow-md w-full sm:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          تواصل مع العميل واتساب
        </a>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-3xl font-black font-arabic text-text-main flex flex-wrap items-center gap-4">
            الطلب <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded tracking-wide">#{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-text-sec text-sm mt-3 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            تاريخ ووقت تسجيل الطلب: {new Date(order.created_at).toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              المنتجات المطلوبة
            </h2>
            <div className="flex flex-col gap-6">
              {order.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-xl bg-bg-secondary relative border border-border overflow-hidden shrink-0 shadow-sm">
                    {item.product?.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product_name || ''} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-sec text-xs">لا صورة</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-main text-lg leading-tight mb-2">{item.product_name || item.product?.name_ar}</h3>
                    <p className="text-sm font-bold text-text-sec bg-bg-secondary inline-block px-3 py-1 rounded-md">
                      الكمية: <span className="text-text-main">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="font-black text-xl tabular-nums text-text-main pr-4">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b border-border pb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              السجل الزمني للحالات
            </h2>
            {(!order.order_status_history || order.order_status_history.length === 0) ? (
              <div className="text-center p-8 bg-bg-secondary rounded-xl font-medium text-text-sec border border-dashed border-border">
                لا يوجد سجل حالات مسجل بعد.
              </div>
            ) : (
              <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:mr-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-200 before:via-border before:to-transparent">
                {order.order_status_history.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((history: any, idx: number) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <div className="w-8 h-8 rounded-full bg-brand-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0 text-brand-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div className="bg-bg-secondary p-4 rounded-xl flex-1 border border-border/70 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                        <div><OrderStatusBadge status={history.status} /></div>
                        <span className="text-xs font-bold text-text-sec bg-white px-2 py-1 rounded border border-border" dir="ltr">
                          {new Date(history.created_at).toLocaleString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {history.note && <p className="text-sm border-t border-border/50 pt-2 mt-2 leading-relaxed text-text-main font-medium">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-5 border-b border-border pb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              معلومات العميل
            </h2>
            <div className="flex flex-col gap-4">
              <div className="bg-bg-secondary p-3 rounded-lg border border-border/50">
                <span className="text-xs text-text-sec font-bold block mb-1">الاسم الكامل</span>
                <span className="font-bold text-text-main text-sm">{order.customer_name}</span>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg border border-border/50">
                <span className="text-xs text-text-sec font-bold block mb-1">الهاتف</span>
                <span className="font-bold text-brand-600 text-sm tracking-widest block" dir="ltr">{order.phone}</span>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg border border-border/50">
                <span className="text-xs text-text-sec font-bold block mb-1">المحافظة والمدينة</span>
                <span className="font-bold text-text-main text-sm">{order.governorate} - {order.city}</span>
              </div>
              <div className="bg-bg-secondary p-3 rounded-lg border border-border/50">
                <span className="text-xs text-text-sec font-bold block mb-1">العنوان التفصيلي</span>
                <span className="font-medium text-text-main text-sm leading-relaxed block">{order.address}</span>
              </div>
              
              {order.notes && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-2 shadow-sm">
                  <span className="text-xs text-yellow-800 font-black flex items-center gap-1.5 mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    ملاحظات مخصصة من العميل:
                  </span>
                  <p className="font-bold text-yellow-900 text-sm leading-relaxed pr-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-5 border-b border-border pb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              ملخص الحساب
            </h2>
            <div className="flex flex-col gap-4 bg-bg-secondary p-5 rounded-xl border border-border/50">
              <div className="flex justify-between items-center text-text-sec font-bold text-sm">
                <span>طريقة الدفع المختارة</span>
                <span className="text-text-main bg-white px-2 py-1 rounded border border-border">{paymentMethods[order.payment_method] || order.payment_method}</span>
              </div>
              <div className="w-full h-px bg-border/80 my-1"></div>
              <div className="flex justify-between items-center text-text-sec font-bold text-sm">
                <span>مجموع سلة المشتريات</span>
                <span className="tabular-nums font-black text-text-main">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-success-600 font-bold bg-success-50 p-2 rounded -mx-2 px-2">
                  <span>الخصومات המأخوذة</span>
                  <span className="tabular-nums">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-2 pt-4 border-t-2 border-dashed border-brand-200 text-xl font-black text-text-main">
                <span>المبلغ المطلوب</span>
                <span className="tabular-nums text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-100">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
