"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCarouselCardProps {
  product: Product;
}

export function ProductCarouselCard({ product }: ProductCarouselCardProps) {
  // Determine badges
  const isDiscounted = product.original_price && product.original_price > product.price;
  const discountPercentage = isDiscounted
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const mainImage = product.images?.[0] || '';

  // WhatsApp Message logic
  const whatsappNumber = "201000000000"; // Fallback, could be passed as prop if available
  const message = `مرحباً، أريد الاستفسار عن المنتج: ${product.name_ar} (رقم: ${product.id})`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="group relative flex-shrink-0 w-[200px] md:w-[240px] snap-start bg-white rounded-xl overflow-hidden shadow-sm border border-border transition-all duration-300 hover:shadow-xl hover:border-brand-200 flex flex-col h-full cursor-pointer">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-0"></Link>
      
      {/* Badges & Icons Container */}
      <div className="absolute top-2 start-2 end-2 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.is_new && (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm w-max">
              جديد
            </span>
          )}
          {isDiscounted && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm w-max">
              خصم {discountPercentage}%
            </span>
          )}
        </div>
        
        {/* Heart Icon (just visual, could be functional later) */}
        <button className="text-gray-300 hover:text-red-500 transition-colors bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
        {mainImage ? (
          <Image 
            src={mainImage} 
            alt={product.name_ar} 
            fill 
            className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
            sizes="(max-width: 768px) 200px, 240px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow bg-white border-t border-border z-10 relative">
        <h3 className="font-bold text-text-main text-sm lg:text-base line-clamp-2 min-h-[40px] font-arabic mb-1 leading-snug">
          {product.name_ar}
        </h3>
        
        <div className="mt-auto pt-2 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-brand-600 text-base md:text-lg tabular-nums shadow-sm">
              {product.price.toLocaleString('eg-US')} ج.م
            </span>
            {isDiscounted && (
              <span className="text-xs text-text-sec line-through tabular-nums decoration-red-400">
                {product.original_price?.toLocaleString('eg-US')}
              </span>
            )}
          </div>
        </div>

        {/* Hover Actions (Desktop) / Always Visible Actions (Mobile) */}
        <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2 max-h-0 opacity-0 overflow-hidden transform translate-y-4 group-hover:max-h-32 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-32 lg:pb-1">
          <Link 
            href={`/product/${product.id}`}
            className="w-full py-2 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center pointer-events-auto shadow-sm"
          >
            تفاصيل المنتج
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-green-500 text-white font-bold text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 pointer-events-auto shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            اشتر الآن
          </a>
        </div>
      </div>
    </div>
  );
}
