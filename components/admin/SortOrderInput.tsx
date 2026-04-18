"use client";

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { updateCategorySortOrder } from '@/lib/actions/adminCategories';

interface SortOrderInputProps {
  categoryId: string;
  initialOrder: number;
}

export function SortOrderInput({ categoryId, initialOrder }: SortOrderInputProps) {
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleBlur = async () => {
    if (order === initialOrder) return;
    
    setIsUpdating(true);
    
    const { success, error } = await updateCategorySortOrder(categoryId, order);
    
    if (success) {
      toast('تم تحديث الترتيب بنجاح', 'success');
    } else {
      toast(`فشل تحديث الترتيب: ${error}`, 'error');
      setOrder(initialOrder); // Revert UI
    }
    
    setIsUpdating(false);
  };

  return (
    <input
      type="number"
      value={order}
      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
      onBlur={handleBlur}
      disabled={isUpdating}
      className={`w-16 h-8 text-center rounded border border-border bg-brand-50 text-brand-600 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-brand-600 ${isUpdating ? 'opacity-50' : ''}`}
    />
  );
}
