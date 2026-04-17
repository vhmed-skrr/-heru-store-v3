"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (dateFilter !== 'all') {
        const today = new Date();
        if (dateFilter === 'today') {
          today.setHours(0, 0, 0, 0);
          query = query.gte('created_at', today.toISOString());
        } else if (dateFilter === 'week') {
          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
          firstDay.setHours(0, 0, 0, 0);
          query = query.gte('created_at', firstDay.toISOString());
        } else if (dateFilter === 'month') {
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          query = query.gte('created_at', firstDay.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const paymentMethods: Record<string, string> = {
    cash: 'الدفع عند الاستلام',
    instapay: 'إنستاباي',
    vodafone_cash: 'فودافون كاش'
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">إدارة الطلبات</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">متابعة وتجهيز ومعالجة طلبات العملاء</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-bold text-text-main">تصفية بحالة الطلب</label>
          <select 
            className="w-full h-11 px-3 py-2 rounded-lg border border-border bg-bg-secondary text-sm font-medium focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="pending">معلق</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">جاري التجهيز</option>
            <option value="shipped">مشحون</option>
            <option value="delivered">مُسلَّم</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="text-xs font-bold text-text-main">تاريخ الطلب</label>
          <select 
            className="w-full h-11 px-3 py-2 rounded-lg border border-border bg-bg-secondary text-sm font-medium focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">كل الأوقات</option>
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-bg-secondary border-b border-border text-xs font-bold text-text-sec tracking-wide">
                <th className="p-4">رقم الطلب</th>
                <th className="p-4">العميل</th>
                <th className="p-4 text-center">الهاتف</th>
                <th className="p-4">طريقة الدفع</th>
                <th className="p-4">المجموع</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4 text-center">الحالة</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center text-text-sec font-medium text-lg">لا توجد طلبات تطابق بحثك حالياً.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-bg-secondary/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-600 text-[13px]">
                      {order.order_number}
                    </td>
                    <td className="p-4 font-bold text-text-main text-sm">
                      {order.customer_name}
                    </td>
                    <td className="p-4 font-medium text-text-sec text-center text-[13px]" dir="ltr">
                      {order.phone}
                    </td>
                    <td className="p-4 text-xs font-medium text-text-sec">
                      {paymentMethods[order.payment_method] || order.payment_method}
                    </td>
                    <td className="p-4 tabular-nums font-black text-text-main">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4 text-xs font-medium text-text-sec" dir="ltr">
                      <span className="block text-right">
                        {new Date(order.created_at).toLocaleDateString('ar-EG', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                      </span>
                      <span className="block text-right opacity-75 mt-0.5">
                        {new Date(order.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-4 flex items-center justify-center">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="px-4 py-2 text-xs font-bold bg-brand-50 text-brand-600 rounded-lg border border-brand-100 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                      >
                        تفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
