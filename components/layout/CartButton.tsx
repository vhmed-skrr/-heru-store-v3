"use client";

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  const getCount = useCartStore((state) => state.getCount);
  const count = getCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenCart = () => {
    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

  return (
    <button
      onClick={handleOpenCart}
      aria-label="Cart"
      className="relative p-2 text-text-main hover:text-brand-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      {mounted && count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white bg-brand-600 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
