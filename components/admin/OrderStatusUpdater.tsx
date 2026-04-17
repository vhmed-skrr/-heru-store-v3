"use client";

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { updateOrderStatus } from '@/lib/actions/updateOrderStatus';

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    if (status === currentStatus && !note) return;

    setLoading(true);
    const { success, error } = await updateOrderStatus({
      order_id: orderId,
      new_status: status,
      note: note
    });

    if (success) {
      toast("تم التحديث بنجاح", "success");
      setNote('');
    } else {
      toast(`فشل التحديث: ${error}`, "error");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-5">
      <h2 className="text-xl font-bold pb-3 border-b border-border">تحديث حالة الطلب</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-text-main">تغيير الحالة الدورية للطلب</label>
        <select 
          className="w-full h-12 px-3 rounded-lg border border-border bg-bg-secondary font-medium text-sm focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">معلق</option>
          <option value="confirmed">مؤكد</option>
          <option value="processing">جاري التجهيز للتغليف</option>
          <option value="shipped">تم الشحن / مع المندوب</option>
          <option value="delivered">مُسلَّم للعميل بنجاح</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-text-main">إضافة ملاحظة إدارية (اختياري)</label>
        <textarea 
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-none text-sm placeholder:text-text-sec leading-relaxed"
          placeholder="دوّن أي ملاحظات إجرائية حول سبب هذا التغيير أو توثيق تواصل مع العميل لحفظها في السجل..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading || (status === currentStatus && !note)}
        className="w-full flex items-center justify-center h-14 rounded-xl bg-brand-600 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-brand-700 shadow-md hover:shadow-lg mt-1"
      >
        {loading ? (
          <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
        ) : (
          "حفظ وإضافة للسجل"
        )}
      </button>
    </div>
  );
}
