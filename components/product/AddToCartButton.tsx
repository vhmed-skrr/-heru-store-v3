"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    addItem({
      id: product.id,
      name_ar: product.name_ar,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
      slug: product.slug,
    });
    
    toast("تمت الإضافة للسلة بنجاح", "success");
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className="w-full bg-brand-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-brand-700 transition-colors active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      أضف للسلة
    </button>
  );
}
