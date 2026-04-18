import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[] | null;
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-bg-main py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black font-arabic text-text-main md:text-4xl tracking-tight uppercase">
            تسوق حسب الفئة!
          </h2>
          <Link href="/shop" className="text-sm font-bold text-text-sec flex items-center gap-1 hover:text-brand-600 transition-colors bg-bg-secondary px-4 py-2 rounded-full border border-border">
            عرض الكل
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 snap-start flex flex-col group relative overflow-hidden"
            >
              {/* Top Tags/Icons */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                <span className="bg-[#FCD34D] text-[#92400E] text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  مُميز
                </span>
                <button className="text-gray-300 hover:text-red-500 transition-colors bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              {/* Main Image Area with subtle background */}
              <div className="relative w-full aspect-[4/5] bg-gray-50 flex items-center justify-center p-6 mt-1 rounded-t-2xl">
                {category.image_url ? (
                  <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                    <Image 
                      src={category.image_url} 
                      alt={category.name_ar} 
                      fill 
                      className="object-contain drop-shadow-md mix-blend-multiply" 
                      sizes="(max-width: 640px) 256px, 288px"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-inner flex items-center justify-center text-white/50 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-6xl drop-shadow-sm">{category.icon || '🛍️'}</span>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col gap-1 border-t border-gray-100 bg-white">
                <span className="text-xs font-bold text-brand-600 line-clamp-1">{category.name_ar}</span>
                <span className="text-sm font-bold text-text-main line-clamp-2 min-h-[40px]">
                  تصفح أحدث منتجات {category.name_ar}
                </span>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-black text-brand-600">تسوق الآن</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
