"use client";

import React, { useState, useEffect } from 'react';

/**
 * WhatsAppFAB — Floating Action Button
 *
 * Features:
 * - Appears after scrolling 300px down (with smooth animation)
 * - Opens a mini popup with a message textarea
 * - Sends the message via wa.me link
 * - Hidden on /admin/* pages
 * - Reads phone number from NEXT_PUBLIC_WHATSAPP_NUMBER env var
 */
export function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSend = () => {
    const msg = message.trim() || 'مرحباً، أريد الاستفسار...';
    const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
    if (!phone) return;

    let finalPhone = phone;
    if (finalPhone.startsWith('01') && finalPhone.length === 11) {
      finalPhone = `2${finalPhone}`;
    }

    window.open(
      `https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setOpen(false);
    setMessage('');
  };

  if (!visible) return null;

  return (
    <>
      {/* Popup */}
      {open && (
        <div
          className="fixed bottom-24 left-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up"
          style={{ animation: 'fadeInUp 0.2s ease-out' }}
        >
          <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" className="text-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-white font-bold text-sm">تواصل معنا عبر واتساب</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              rows={3}
              dir="rtl"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-text-main placeholder:text-text-sec focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
            />
            <button
              onClick={handleSend}
              className="w-full py-2.5 bg-[#25D366] text-white font-bold rounded-lg text-sm hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              إرسال عبر واتساب
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </>
  );
}
