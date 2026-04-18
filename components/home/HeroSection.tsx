import React from 'react';
import Link from 'next/link';

/** 7-day window for "جديد" badge — mirrors ProductCard.tsx */
const NEW_PRODUCT_MS = 7 * 24 * 60 * 60 * 1000;

export function HeroSection({ settings }: { settings: Record<string, string> | null }) {
  const title    = settings?.hero_title        || 'أفضل المنتجات بأقل الأسعار';
  const subtitle = settings?.hero_subtitle     || 'اكتشف تشكيلة واسعة من المنتجات المميزة التي تليق بك.';

  /**
   * CTA button texts — previously hardcoded; now driven by settings.
   * Keys match exactly what adminSettings.ts upserts:
   *   hero_cta_primary   → "تسوق الآن"  (default)
   *   hero_cta_secondary → "اقترح تصميم" (default)
   */
  const ctaPrimary   = settings?.hero_cta_primary   || 'تسوق الآن';
  const ctaSecondary = settings?.hero_cta_secondary || 'اقترح تصميم';

  return (
    <section className="w-full bg-gradient-to-r from-brand-600 to-brand-700 h-[320px] md:h-[420px] flex items-center justify-center text-center px-4">
      <div className="max-w-3xl flex flex-col items-center">
        <h1 className="text-white font-arabic font-black text-4xl md:text-6xl mb-4 md:mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-brand-50 text-lg md:text-xl mb-8 max-w-2xl font-medium opacity-90">
          {subtitle}
        </p>
        <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-600 font-bold rounded-md hover:bg-brand-50 transition-colors shadow-lg"
          >
            {ctaPrimary}
          </Link>
          <Link
            href="/suggest"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors"
          >
            {ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
