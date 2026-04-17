"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { CartItem } from './CartItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-cart-drawer', handleOpen);
    return () => window.removeEventListener('open-cart-drawer', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const toggleCart = () => setIsOpen(!isOpen);

  const handleCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-text-main/30 backdrop-blur-sm z-[80] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleCart}
        aria-hidden="true"
      />

      <div 
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-[420px] bg-background z-[90] shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border bg-white shadow-sm z-10">
          <div className="flex items-center gap-2 text-brand-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span className="font-arabic font-bold text-xl pb-1">سلة مشترياتك</span>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 text-text-sec hover:bg-brand-50 hover:text-brand-600 rounded-full transition-colors bg-bg-secondary"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center pb-20">
              <EmptyState 
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>}
                title="سلتك فارغة"
                description="لم تقم بإضافة أي منتجات للسلة بعد."
                action={
                  <button onClick={() => { toggleCart(); router.push('/shop'); }} className="px-6 py-2.5 mt-4 bg-brand-600 text-white font-medium rounded-md hover:bg-brand-700 transition-colors">
                    تصفح المتجر
                  </button>
                }
                className="bg-transparent border-none"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border bg-white shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-lg text-text-main pb-4 border-b border-border border-dashed">
              <span>الإجمالي:</span>
              <span className="text-brand-600 tabular-nums text-xl">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex gap-3 mt-1">
              <button onClick={() => { toggleCart(); router.push('/cart'); }} className="flex-1 px-4 py-3.5 border border-border text-text-main hover:bg-bg-secondary font-bold rounded-md transition-colors text-center text-sm md:text-base">
                عرض السلة
              </button>
              <button onClick={handleCheckout} className="flex-[1.5] px-4 py-3.5 bg-brand-600 text-white hover:bg-brand-700 font-bold rounded-md transition-colors text-center shadow-md active:scale-95 text-sm md:text-base">
                إتمام الطلب
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
