"use client";

import React from 'react';
import Image from 'next/image';
import { useCartStore, CartItem as ICartItem } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export function CartItem({ item }: { item: ICartItem }) {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0 bg-white md:bg-transparent">
      <Link href={`/product/${item.slug}`} className="relative w-[60px] h-[60px] rounded-md overflow-hidden bg-bg-secondary flex-shrink-0 border border-border shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name_ar} fill className="object-cover" sizes="60px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-text-sec">لا صورة</div>
        )}
      </Link>
      
      <div className="flex-1 flex flex-col min-w-0">
        <Link href={`/product/${item.slug}`} className="text-sm font-bold text-text-main truncate hover:text-brand-600 transition-colors mb-1">
          {item.name_ar}
        </Link>
        <div className="text-brand-600 font-bold tabular-nums text-sm mb-2">
          {formatPrice(item.price * item.quantity)}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-md bg-white">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-text-main hover:bg-bg-secondary hover:text-brand-600 transition-colors rounded-r-md"
              aria-label="Decrease"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-text-main hover:bg-bg-secondary hover:text-brand-600 transition-colors rounded-l-md"
              aria-label="Increase"
            >
              +
            </button>
          </div>
          <button 
            onClick={() => removeItem(item.id)}
            className="flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors mr-auto"
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
