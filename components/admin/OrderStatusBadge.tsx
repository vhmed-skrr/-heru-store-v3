import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let config = {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200'
  };

  switch (status) {
    case 'pending':
      config = { label: 'معلق', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      break;
    case 'confirmed':
      config = { label: 'مؤكد', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      break;
    case 'processing':
      config = { label: 'جاري التجهيز', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      break;
    case 'shipped':
      config = { label: 'مشحون', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      break;
    case 'delivered':
      config = { label: 'مُسلَّم', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      break;
    case 'cancelled':
      config = { label: 'ملغي', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-black border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}
