"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Suggestion } from '@/types';
import { updateSuggestionStatus, deleteSuggestion } from '@/lib/actions/adminSuggestions';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG: Record<Suggestion['status'], { label: string; color: string; next: Suggestion['status'] | null; nextLabel: string }> = {
  new:      { label: 'جديد',     color: 'bg-blue-50 text-blue-700 border-blue-200',    next: 'reviewed',  nextLabel: 'تحديد كـ مراجَع' },
  reviewed: { label: 'مراجَع',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200', next: 'approved',  nextLabel: 'قبول' },
  approved: { label: 'مقبول',    color: 'bg-success-50 text-success-700 border-success-200', next: 'rejected',  nextLabel: 'رفض' },
  rejected: { label: 'مرفوض',   color: 'bg-red-50 text-red-700 border-red-200',       next: null,        nextLabel: '' },
};

interface Props {
  initialSuggestions: Suggestion[];
}

export function SuggestionsAdminClient({ initialSuggestions }: Props) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isPending, startTransition] = useTransition();
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleStatusChange = (id: string, status: Suggestion['status']) => {
    startTransition(async () => {
      const { success, error } = await updateSuggestionStatus(id, status);
      if (success) {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
        toast('تم تحديث الحالة', 'success');
      } else {
        toast(`خطأ: ${error}`, 'error');
      }
    });
  };

  const handleDelete = (id: string, name: string | null) => {
    if (!window.confirm(`هل أنت متأكد من حذف اقتراح "${name || 'بدون اسم'}"؟`)) return;
    startTransition(async () => {
      const { success, error } = await deleteSuggestion(id);
      if (success) {
        setSuggestions(prev => prev.filter(s => s.id !== id));
        toast('تم حذف الاقتراح', 'success');
      } else {
        toast(`خطأ: ${error}`, 'error');
      }
    });
  };

  return (
    <>
      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <Image src={lightboxUrl} alt="صورة الاقتراح" width={800} height={800} className="object-contain rounded-xl max-h-[80vh] w-full" />
            <button onClick={() => setLightboxUrl(null)} className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100">✕</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-bg-secondary border-b border-border text-sm font-bold text-text-sec">
              <tr>
                <th className="p-4">المقترح</th>
                <th className="p-4">الوصف</th>
                <th className="p-4 w-24 text-center">الصورة</th>
                <th className="p-4 w-32">الحالة</th>
                <th className="p-4 w-28">التاريخ</th>
                <th className="p-4 w-40 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-sec font-medium">لا توجد اقتراحات حالياً</td>
                </tr>
              ) : (
                suggestions.map((s) => {
                  const cfg = STATUS_CONFIG[s.status];
                  return (
                    <tr key={s.id} className="border-b border-border hover:bg-bg-secondary/40 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-bold text-text-main">{s.name || '—'}</div>
                        {s.phone && (
                          <div className="text-xs text-text-sec mt-1 font-medium" dir="ltr">{s.phone}</div>
                        )}
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <p className="text-sm text-text-sec leading-relaxed line-clamp-3 whitespace-normal">{s.description}</p>
                      </td>
                      <td className="p-4 align-top text-center">
                        {s.image_url ? (
                          <button onClick={() => setLightboxUrl(s.image_url!)} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-bg-secondary mx-auto block hover:opacity-80 transition-opacity">
                            <Image src={s.image_url} alt="صورة" fill className="object-cover" sizes="64px" />
                          </button>
                        ) : (
                          <span className="text-xs text-text-sec">لا صورة</span>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-4 align-top text-xs text-text-sec whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center justify-center gap-2">
                          {cfg.next && (
                            <button
                              onClick={() => handleStatusChange(s.id, cfg.next!)}
                              disabled={isPending}
                              className="px-2 py-1 rounded-md text-xs font-bold bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {cfg.nextLabel}
                            </button>
                          )}
                          {s.status !== 'new' && (
                            <button
                              onClick={() => handleStatusChange(s.id, 'new')}
                              disabled={isPending}
                              className="px-2 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-600 border border-border hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50"
                              title="إعادة تعيين"
                            >
                              ↺
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            disabled={isPending}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
