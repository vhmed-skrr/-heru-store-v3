"use client";

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { toggleCategoryHomepage } from '@/lib/actions/adminCategories';

interface ToggleHomepageButtonProps {
  categoryId: string;
  initialValue: boolean;
}

export function ToggleHomepageButton({ categoryId, initialValue }: ToggleHomepageButtonProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [checked, setChecked] = useState(initialValue);
  const { toast } = useToast();

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.target.checked;
    
    setIsToggling(true);
    setChecked(newValue);
    
    const { success, error } = await toggleCategoryHomepage(categoryId, newValue);
    
    if (success) {
      toast(`تم ${newValue ? 'إظهار' : 'إخفاء'} التصنيف في الرئيسية بنجاح`, 'success');
    } else {
      setChecked(!newValue); // Revert UI
      toast(`فشل تحديث حالة التصنيف: ${error}`, 'error');
    }
    
    setIsToggling(false);
  };

  return (
    <label title="إظهار في الرئيسية" className="flex items-center cursor-pointer relative bg-brand-50 p-1 rounded hover:bg-brand-100 transition-colors">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={handleToggle}
        disabled={isToggling}
      />
      <div className={`w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:start-[6px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-600 ${isToggling ? 'opacity-50' : ''}`}></div>
    </label>
  );
}
