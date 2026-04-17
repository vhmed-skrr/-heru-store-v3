import React from 'react';
import Link from 'next/link';

export function OfferBanner({ settings }: { settings: Record<string, string> | null }) {
  return (
    <section className="w-full bg-[#111827] py-16 px-4 flex items-center justify-center text-center">
      <div className="max-w-2xl flex flex-col items-center">
        <h2 className="text-white font-arabic font-black text-4xl md:text-5xl mb-3">
          عروض حصرية
        </h2>
        <div className="text-orange-500 font-black text-6xl md:text-8xl mb-6 font-arabic">
          50%
        </div>
        <p className="text-gray-300 text-lg mb-8 max-w-xl font-medium">
          خصومات تصل إلى 50% على أفضل المنتجات والتشكيلات. لا تفوت الفرصة واطلب الآن.
        </p>
        <Link 
          href="/shop?sale=true" 
          className="px-10 py-4 bg-brand-600 text-white font-bold rounded-md hover:bg-brand-700 transition-colors shadow-lg text-lg"
        >
          تسوق الآن
        </Link>
      </div>
    </section>
  );
}
